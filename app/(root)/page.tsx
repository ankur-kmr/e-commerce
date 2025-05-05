import { Metadata } from "next";
import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";

export const metadata: Metadata = {
  title: 'Home',
};

export default async function HomePage() {
  const latestProducts = await getLatestProducts();
  return (
    <>
      <ProductList data={latestProducts} title="New Arrivals" />
    </>
  );
}
