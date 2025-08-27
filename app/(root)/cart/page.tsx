import Link from 'next/link';
import { Metadata } from 'next';
import CartTable from './cart-table';
import { getMyCart } from '@/lib/actions/cart.actions';
import CartSummary from './cart-summary';

export const metadata: Metadata = {
    title: "ShoppingCart",
    description: "Cart Page",
}

const CartPage = async () => {
    const cart = await getMyCart();
    
    return (
        <>
          <h1 className='py-4 h2-bold'>Shopping Cart</h1>
          {!cart || cart.items.length === 0 ? (
            <div>
              Cart is empty. <Link href='/'>Go shopping</Link>
            </div>
          ) : (
            <div className='grid md:grid-cols-4 md:gap-5'>
              <div className='overflow-x-auto md:col-span-3'>
                <CartTable cart={cart} />
              </div>
              <div className=''>
                <CartSummary cart={cart} />
              </div>
            </div>
          )}
        </>
      );
}

export default CartPage;