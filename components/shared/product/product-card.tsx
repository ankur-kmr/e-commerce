import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import ProductPrice from "./product-price";
import { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="p-0 items-center">
                <Link href={`/product/${product.slug}`}>
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={300}
                        height={300}
                        priority
                        className="w-full h-full object-cover"
                    />
                    
                </Link>
            </CardHeader>
            <CardContent className="grid gap-4 p-4">
                <div className="text-xs">{product.brand}</div>
                <Link href={`/product/${product.slug}`}>
                    <CardTitle className="text-sm font-medium">{product.name}</CardTitle>
                </Link>
                <div className="flex-between">
                    <p className="text-sm font-medium">{product.rating}</p>
                    {product.stock > 0 ? (
                        <ProductPrice value={Number(product.price)} />
                    ) : (
                        <p className="text-destructive">Out of Stock</p>
                    )}
                </div>
                <CardDescription>{product.description}</CardDescription>
            </CardContent>
        </Card>
    )
}