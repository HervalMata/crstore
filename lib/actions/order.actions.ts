'use server';

import {isRedirectError} from "next/dist/client/components/redirect-error";
import {convertToPlainObject, formatError} from "@/lib/utils";
import {auth} from "@/auth";
import {getMyCart} from "@/lib/actions/cart.actions";
import {getUserById} from "@/lib/actions/user.actions";
import {insertOrderSchema} from "@/lib/validator";
import {prisma} from "@/db/prisma";
import {CartItem, PaymentResult} from "@/types";
import {paypal} from "@/lib/paypal";
import {revalidatePath} from "next/cache";

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

export async function createPaypalOrder(orderId: string) {
    try {
        const order = await prisma.order.findFirst({
            where: { id: orderId },
        });

        if (order) {
            const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

            await prisma.order.update({
                where: { id: orderId },
                data: {
                    paymentResult: {
                        id: paypalOrder.id,
                        email_address: '',
                        status: '',
                        pricePaid: 0,
                    },
                },
            });

            return {
                success: true,
                message: 'Item da Ordem Paypal Criada com sucesso.',
                data: paypalOrder.id,
            };
        } else {
            throw new Error(formatError('Ordem não encontrada.'));
        }
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function approvePaypalOrder(
    orderId: string,
    data: { OrderId: string },
) {
    try {
        const order = await prisma.order.findFirst({
            where: { id: orderId },
        });

        if (!order) new Error(`Ordem não encontrada.`);

        const captureData = await paypal.capturePayment(data.OrderId);

        if (
            !captureData ||
            captureData.id !== (order?.paymentResult as PaymentResult)?.id ||
            captureData.status !== "COMPLETED"
        ) {
            throw new Error('Erro ao processar pagamento pelo paypal.');
        }

        await updateOrderToPaid({
            orderId,
            paymentResult: {
                id: captureData.id,
                email_address: captureData.payer.email_address,
                status: captureData.status,
                pricePaid: captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
            },
        });

        revalidatePath(`/order/${orderId}`);

        return {
            success: true,
            message: 'Sua Ordem Paypal foi paga com sucesso.',
        };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

async function updateOrderToPaid({
    orderId,
    paymentResult,
} : {
    orderId: string;
    paymentResult?: PaymentResult;
}) {
    const order = await prisma.order.findFirst({
        where: { id: orderId },
        include: {
            orderItems: true,
        },
    });

    if (!order) new Error(`Ordem não encontrada.`);

    if (order.isPaid) throw new Error('Ordem já foi paga.');

    await prisma.$transaction(async (tx) => {
        for (const item of order.orderItems) {
            await tx.product.update({
                where: {
                    id: item.productId,
                },
                data: {
                    stock: {
                        increment: -item.qty,
                    },
                },
            });
        }

        await tx.order.update({
            where: {
                id: order.id,
            },
            data: {
                isPaid: true,
                paidAt: new Date(),
                paymentResult,
            },
        });
    });

    const updatedOrder = await prisma.order.findFirst({
        where: {
            id: orderId,
        },
        include: {
            orderItems: true,
            user: { select: { name: true, email: true } },
        },
    });

    if (!updatedOrder) {
        throw new Error('Ordem não encontrada.');
    }
}