'use server';

import { prisma } from "@/db/prisma";
import {convertToPlainObject, formatError} from "@/lib/utils";
import {LATEST_PRODUCTS_LIMIT, PAGE_SIZE} from "@/lib/constants";
import {revalidatePath} from "next/cache";
import {z} from "zod";
import {insertProductSchema, updateProductSchema} from "@/lib/validator";

export async function getLatestProducts() {

    const data = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: { createdAt: 'desc' },
    });

    return convertToPlainObject(data);
}

export async function getProductBySlug(slug: string) {

    return await prisma.product.findFirst({
        where: { slug: slug },
    });

}

export async function getAllProducts({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    query,
    limit = PAGE_SIZE,
    page,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    category,
} : {
    query: string;
    limit?: number;
    page: number;
    category?: string;
}) {
    const data = await prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
    });

    const dataCount = await prisma.product.count();

    return {
        data,
        totalPages: Math.ceil(dataCount / limit),
    }
}

export async function deleteProduct(id: string) {
    try {
        const productExists = await prisma.product.findFirst({
            where: { id },
        });

        if (!productExists) throw new Error('Produto não encontrado.');

        await prisma.product.delete({ where: { id } });

        revalidatePath('/admin/products');

        return {
            success: true,
            message: 'Produto removido com sucesso.',
        }
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function createProduct(data: z.infer<typeof insertProductSchema>) {
    try {
        const product = insertProductSchema.parse(data);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await prisma.product.create({ data: product });

        revalidatePath('/admin/products');

        return {
            success: true,
            message: 'Produto criado com sucesso.',
        }
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
    try {
        const product = updateProductSchema.parse(data);
        const productExists = await prisma.product.findFirst({
            where: { id: product.id },
        });

        if (!productExists) throw new Error('Produto não encontrado.');

        await prisma.product.update({ 
            where: { id: product.id },
            data: product,
        });

        revalidatePath('/admin/products');

        return {
            success: true,
            message: 'Produto atualizado com sucesso.',
        }
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}