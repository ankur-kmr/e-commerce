"use client";

import { Cart } from "@/types";
import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from "next/link";
import Image from "next/image";
import { Loader, Minus, Plus } from "lucide-react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
// import { useRouter } from "next/navigation";

const CartTable = ({ cart }: { cart: Cart }) => {
    // const { items, totalPrice } = cart;
    // const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className='text-center'>Quantity</TableHead>
                    <TableHead className='text-right'>Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cart.items.map((item) => (
                        <TableRow key={item.slug}>
                            <TableCell>
                                <Link href={`/product/${item.slug}`} className='flex items-center'>
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={50}
                                    height={50}
                                ></Image>
                                <span className='px-2'>{item.name}</span>
                                </Link>
                            </TableCell>
                            <TableCell className='flex-center gap-2'>
                                <Button
                                    disabled={isPending}
                                    variant='outline'
                                    type='button'
                                    onClick={() =>
                                    startTransition(async () => {
                                        const res = await removeItemFromCart(item.productId);
                                        if (!res.success) {
                                        toast({
                                            variant: 'destructive',
                                            title: 'Error',
                                            description: res.message,
                                        });
                                        }
                                    })
                                    }
                                >
                                    {isPending ? (
                                    <Loader className='w-4 h-4  animate-spin' />
                                    ) : (
                                    <Minus className='w-4 h-4' />
                                    )}
                                </Button>
                                <span>{item.qty}</span>
                                <Button
                                    disabled={isPending}
                                    variant='outline'
                                    type='button'
                                    onClick={() =>
                                    startTransition(async () => {
                                        const res = await addItemToCart(item);
                                        if (!res.success) {
                                        toast({
                                            variant: 'destructive',
                                            title: 'Error',
                                            description: res.message,
                                        });
                                        }
                                    })
                                    }
                                >
                                    {isPending ? (
                                    <Loader className='w-4 h-4  animate-spin' />
                                    ) : (
                                    <Plus className='w-4 h-4' />
                                    )}
                                </Button>
                            </TableCell>
                            <TableCell className='text-right'>${item.price}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

export default CartTable;