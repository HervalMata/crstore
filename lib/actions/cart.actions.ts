'use server';

import {CartItem} from "@/types";
import {cookies} from "next/headers";
import {auth} from "@/auth";
import {prisma} from "@/db/prisma";
import {convertToPlainObject, formatError, round2} from "@/lib/utils";
import {cartItemSchema, insertCartSchema} from "@/lib/validator";
import {revalidatePath} from "next/cache";
import {Prisma} from "@prisma/client";

const calcPrice = (items: CartItem[]) => {
    const itemPrice = round2(
        items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = round2(itemPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemPrice),
    totalPrice =round2(itemPrice + taxPrice + shippingPrice);

    return {
        itemPrice: itemPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
    }
};

export async function addItemToCart(data: CartItem) {
    try {
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if (!sessionCartId) throw new Error('Carrinho não encontrado.');

        const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string) : undefined;
        const cart = await getMyCart();
        const item = cartItemSchema.parse(data);
        const product = await prisma.product.findFirst({
            where: {id: item.productId},
        });
        if (!product) throw new Error('Produto não encontrado.');

        if (!cart) {
            const newCart = insertCartSchema.parse({
                userId: userId,
                items: [item],
                sessionCartId: sessionCartId,
                ...calcPrice([item]),
            });

            await prisma.cart.create({
                // @ts-ignore
                data: newCart,
            });

            revalidatePath(`/products/${product.slug}`);

            return {
                success: true,
                message: `Itens Adicionados para o carrinho`,
            };
        } else {
            const existItem = (cart.items as CartItem[]).find(
                (x) => x.productId === item.productId
            );

            if (existItem) {
                if (product.stock < existItem.qty + 1) {
                    throw new Error('Sem Estoque');
                }

                (cart.items as CartItem[]).find(
                    (x) => x.productId === item.productId)!.qty = existItem.qty + 1;
            } else {
                if (product.stock < 1) throw new Error('Sem Estoque');

                cart.items.push(item);
            }

            await prisma.cart.update({
                where: { id: cart.id },
                data: {
                    items: cart.items as Prisma.CartUpdateitemsInput[],
                    ...calcPrice(
                        cart.items as CartItem[],
                    ),
                },
            });

            revalidatePath(`/products/${product.slug}`);

            return {
                success: true,
                message: `${product.name} ${existItem ? 'Atuslizando o' : 'Adicionando para o'} carrinho`,
            };
        }
    }  catch (error) {
        return {
            success: true,
            message: formatError(error),
        }
    }
}

export async function getMyCart() {
     const sessionCartId = (await cookies()).get('sessionCartId')?.value;
     if (!sessionCartId) throw new Error('Carrinho n-ao encontrado.');

     const session = await auth();
     const userId = session?.user?.id ? (session.user.id as string) : undefined;
     const cart = await prisma.cart.findFirst({
         where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
     });

     if (!cart) return undefined;

     return convertToPlainObject({
         ...cart,
         items: cart.items as CartItem[],
         itemsPrice: cart.itemsPrice.toString(),
         totalPrice: cart.totalPrice.toString(),
         shippingPrice: cart.shippingPrice.toString(),
         taxRate: cart.taxPrice.toString(),
     });
}