"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Cart } from "@/types";
import { ArrowRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function CartSummary({ cart }: { cart: Cart }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    return (
        <Card>
            <CardContent className='p-4 gap-4'>
                <div className='pb-3 text-xl'>
                    Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)}) : {formatCurrency(cart.itemsPrice)}
                </div>
                <Button
                    onClick={() => startTransition(() => router.push('/shipping-address'))}
                    className='w-full'
                    disabled={isPending}
                >
                    {isPending ? (
                        <Loader className='animate-spin w-4 h-4' />
                    ) : (
                        <ArrowRight className='w-4 h-4' />
                    )}
                    Proceed to Checkout
                </Button>
            </CardContent>
        </Card>
    )
}