'use server';

import { auth, signIn, signOut } from '@/auth';
import { shippingAddressSchema, signInFormSchema, signUpFormSchema } from '../validators'; 
import { isRedirectError } from 'next/dist/client/components/redirect-error';
// import { ZodError } from 'zod';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
import { formatError } from '../utils';
import { ShippingAddress } from '@/types';
import { paymentMethodSchema } from '../validators';
import z from 'zod';

// Sign in the user with credentials
export async function signInWithCredentials(
    prevState: unknown,
    formData: FormData
) {
    try {
      const user = signInFormSchema.parse({
        email: formData.get('email'),
        password: formData.get('password'),
      });
  
      await signIn('credentials', user);
  
      return { success: true, message: 'Signed in successfully' };
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
  
      return { success: false, message: 'Invalid email or password' };
    }
}

  // Sign the user out
export async function signOutUser() {
    try {
        await signOut({ redirectTo: '/' });
    } catch (error) {
        // Don't re-throw redirect errors as they are expected
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            return;
        }
        console.error('Error signing out:', error);
        throw error;
    }
}

// Sign up the user with credentials
export async function signUpUser(
    prevState: unknown,
    formData: FormData
) {

    try {
        const user = signUpFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        });

        const hashedPassword = hashSync(user.password, 10);

        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: hashedPassword,
            },
        });

        await signIn('credentials', {
          name: user.name,
          email: user.email,
          password: user.password,
        });

        return { success: true, message: 'Signed up successfully' };
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
      return {
        success: false,
        message: formatError(error),
      };
    }
}

// Get user by ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) throw new Error('User not found');
  return user;
}

// Update user's address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error('User not found');

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update user's payment method
export async function updateUserPaymentMethod(data: z.infer<typeof paymentMethodSchema>) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error('User not found');

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: 'Payment method updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}