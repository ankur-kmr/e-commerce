'use server'

import { PrismaClient } from "@prisma/client";
import { convertPrismaToPlainObject } from "@/lib/utils";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";

const prisma = new PrismaClient();

export async function getLatestProducts() {
    const products = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: {
            createdAt: 'desc',
        },
    });
    return convertPrismaToPlainObject(products);
}

