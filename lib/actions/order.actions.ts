'use server';

import {isRedirectError} from "next/dist/client/components/redirect-error";
import {convertToPlainObject, formatError} from "@/lib/utils";
import {auth} from "@/auth";
import {getMyCart} from "@/lib/actions/cart.actions";
import {getUserById} from "@/lib/actions/user.actions";
import {insertOrderSchema} from "@/lib/validator";
import {prisma} from "@/db/prisma";
import {CartItem} from "@/types";

export const createOrder = async () => {
    try {
        const session = await auth();

        if (!session) throw new Error("Usuário não autorizado.");

        const cart = await getMyCart();
        const userId = session?.user?.id;

        if (!userId) throw new Error("Usuário não encontrado.");

        const user = await getUserById(userId);

        if (!cart || cart.items.length === 0) {
            return {
                success: false,
                message: 'Seu carrinho está vazio.',
                redirect: '/cart',
            };
        }

        if (!user.address) {
            return {
                success: false,
                message: 'Você não tem endereço de entrega.',
                redirect: '/shipping-address',
            };
        }

        if (!user.paymentMethod) {
            return {
                success: false,
                message: 'Você não tem nenhum metódo de pagamento cadastrado..',
                redirect: '/payment-method',
            };
        }

        const order = insertOrderSchema.parse({
            userId: userId,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        });

        const insertedOrderId = await prisma.$transaction(async (tx) => {
            
            const insertedOrder = await tx.order.create({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                data: order
            });

            for (const item of cart.items as CartItem[]) {
                await tx.orderItem.create({
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    data: {
                        ...item,
                        price: item.price,
                        orderId: insertedOrder.id,
                    },
                })
            }

            await tx.cart.update({
                where: { id: cart.id },
                data: {
                    items: [],
                    totalPrice: 0,
                    taxPrice: 0,
                    shippingPrice: 0,
                    itemsPrice: 0,
                },
            });

            return insertedOrder.id;
        });

        if (!insertedOrderId) throw new Error("A ordem não foi criada.");

        return {
            success: true,
            message: 'Ordem criada.',
            redirect: `/order/${insertedOrderId}`,
        }
    } catch (error) {
        if (isRedirectError(error)) throw error;
        return {
            success: false,
            message: formatError(error),
        };
    }
}

export async function getOrderById(orderId: string) {
    const data = await prisma.order.findFirst({
        where: {
            id: orderId,
        },
        include: {
            orderItems: true,
            user: { select: { name: true, email: true } },
        },
    });

    return convertToPlainObject(data);
}