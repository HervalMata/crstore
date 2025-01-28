import {CartItem} from "@/types";
import {cookies} from "next/headers";
import {auth} from "@/auth";
import {prisma} from "@/db/prisma";
import {convertToPlainObject, formatError} from "@/lib/utils";
import {cartItemSchema} from "@/lib/validator";

export async function addItemToCart(data: CartItem) {
    try {
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if (!sessionCartId) throw new Error('Carrinho n-ao encontrado.');

        const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string) : undefined;
        const cart = await getMyCart();
        const item = cartItemSchema.parse(data);
        const product = await prisma.product.findFirst({
            where: {id: item.productId},
        });

        console.log({
            'Session Cart ID': sessionCartId,
            'User ID': userId,
            'Item Requested': item,
            'Product Found': product,
        });

        return {
            success: true,
            message: `Itens Adicionados para o carrinho`,
        };
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