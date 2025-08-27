'use server';

import { auth } from '@/auth';
import { CartItem } from '@/types';
import { cookies } from 'next/headers';
import { formatError, round2 } from '../utils';
import { prisma } from '@/db/prisma';
import { convertPrismaToPlainObject } from '@/lib/utils';
import { cartItemSchema, insertCartSchema } from '../validators';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

// Calculate cart price based on items
function calcPrice (items: z.infer<typeof cartItemSchema>[]) {
    const itemsPrice = round2(
        items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
      ),
      shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
      taxPrice = round2(0.15 * itemsPrice),
      totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
    return {
      itemsPrice: itemsPrice.toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      taxPrice: taxPrice.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
    };
  };

export async function addItemToCart(data: CartItem) {
    try {
        // Check for session cart cookie
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if (!sessionCartId) throw new Error('Cart Session not found');
    
        // Get session and user ID
        const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string) : undefined;
  
        // Get cart from database
        const cart = await getMyCart();
        // Parse and validate submitted item data
        const item = cartItemSchema.parse(data);
        // Find product in database
        const product = await prisma.product.findFirst({
            where: { id: item.productId },
        });
        if (!product) throw new Error('Product not found');

        if (!cart) {
            // Create new cart object
            const newCart = insertCartSchema.parse({
              userId: userId,
              items: [item],
              sessionCartId: sessionCartId,
              ...calcPrice([item]),
            });
            // Add to database
            await prisma.cart.create({
              data: newCart,
            });
          
            // Revalidate product page
            revalidatePath(`/product/${product.slug}`);
          
            return {
              success: true,
              message: `${item.name} added to cart`,
            };
        } else {
          // Check for existing item in cart
          const existingItem = (cart.items as CartItem[]).find(
            (x) => x.productId === item.productId
          );
          // If not enough stock, throw error
          if (existingItem) {
            if (product.stock < existingItem.qty + 1) {
              throw new Error('Not enough stock');
            }
        
            // Increase quantity of existing item
            (cart.items as CartItem[]).find(
              (x) => x.productId === item.productId
            )!.qty = existingItem.qty + 1;
          } else {
            // If stock, add item to cart
            if (product.stock < 1) throw new Error('Not enough stock');
            cart.items.push(item);
          }
        
          // Save to database
          await prisma.cart.update({
            where: { id: cart.id },
            data: {
              items: cart.items as Prisma.CartUpdateitemsInput[],
              ...calcPrice(cart.items as CartItem[]),
            },
          });
        
          revalidatePath(`/product/${product.slug}`);
        
          return {
            success: true,
            message: `${product.name} ${
              existingItem ? 'updated in' : 'added to'
            } cart successfully`,
          };
        }
    } catch (error) {
        console.log(error, 'error <<---');
      return { success: false, message: formatError(error) };
    }
};

// Remove item from cart in database
export async function removeItemFromCart (productId: string) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart Session not found');

    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error('Product not found');

    const cart = await getMyCart();
    if (!cart) throw new Error('Cart not found');

    const existingItem = (cart.items as CartItem[]).find((x) => x.productId === productId);
    if (!existingItem) throw new Error('Item not found');

    if (existingItem.qty === 1) {
      // Remove item from cart
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== existingItem.productId
      );
    } else {
      // Decrease quantity of existing item
      (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty =
        existingItem.qty - 1;
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name}  ${
        (cart.items as CartItem[]).find((x) => x.productId === productId)
          ? 'updated in'
          : 'removed from'
      } cart successfully`,
    };

  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export async function getMyCart() {
  // Check for session cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) return undefined;

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id;

  // Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  // Convert Decimal values to strings
  return convertPrismaToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}