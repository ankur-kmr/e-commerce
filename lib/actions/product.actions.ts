'use server'

import { prisma } from "@/db/prisma";
import { convertPrismaToPlainObject } from "@/lib/utils";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";


export async function getLatestProducts() {
    const products = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: {
            createdAt: 'desc',
        },
    });
    return convertPrismaToPlainObject(products);
}

// Get single product by slug
export async function getProductBySlug(slug: string) {
    const product = await prisma.product.findFirst({
        where: { slug },
    });
    return convertPrismaToPlainObject(product);
}

