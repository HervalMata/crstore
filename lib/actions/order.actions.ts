'use server';

import {isRedirectError} from "next/dist/client/components/redirect-error";
import {convertToPlainObject, formatError} from "@/lib/utils";
import {auth} from "@/auth";
import {getMyCart} from "@/lib/actions/cart.actions";
import {getUserById} from "@/lib/actions/user.actions";
import {insertOrderSchema} from "@/lib/validator";
import {prisma} from "@/db/prisma";
import {CartItem, PaymentResult, ShippingAddress} from "@/types";
import {paypal} from "@/lib/paypal";
import {revalidatePath} from "next/cache";
import {PAGE_SIZE} from "@/lib/constants";
import {Prisma} from "@prisma/client";
import {sendPurchaseReceipt} from "@/email";

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

export async function updateOrderToPaid({
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

    await sendPurchaseReceipt({
        order: {
            ...updatedOrder,
            shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
            paymentResult: updatedOrder.paymentResult as PaymentResult,
        },
    });
}

export async function getMyOrders({
    limit = PAGE_SIZE,
    page,
} : {
    limit?: number;
    page: number;
}) {
    const session = await auth();
    if (!session) throw new Error('Usuário não está autorizado.');

    const data = await prisma.order.findMany({
        where: { userId: session?.user?.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
    });

    const dataCount = await prisma.order.count({
        where: { userId: session?.user?.id },
    });

    return {
        data,
        totalPages: Math.ceil(dataCount/limit),
    };
}

type salesDataType = {
    month: string;
    totalSales: number;
}[];

export async function getOrderSummary() {
    const ordersCount = await prisma.order.count();
    const productsCount = await prisma.product.count();
    const usersCount = await prisma.user.count();

    const totalSales = await prisma.order.aggregate({
        _sum: { totalPrice: true },
    });

    const salesDataRaw = await prisma.$queryRaw<Array<{ month: string; totalSales: Prisma.Decimal }>>`SELECT to_char("createdAt", "MM/YY") as "month",
        sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", "MM/YY")`;

    const salesData: salesDataType = salesDataRaw.map((entry) => ({
        month: entry.month,
        totalSales: Number(entry.totalSales),
    }));

    const latestSales = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true } },
        },
        take: 6,
    });

    return {
        ordersCount,
        productsCount,
        usersCount,
        totalSales,
        latestSales,
        salesData: convertToPlainObject(salesData) as salesDataType,
    };

}

export async function getAllOrders({
    limit = PAGE_SIZE,
    page,
    query,
} : {
    limit?: number;
    page: number;
    query: string;
}) {
    const queryFilter: Prisma.UserWhereInput =
        query && query !== 'all'
            ? {
                name: {
                    contains: query,
                    mode: 'insensitive',
                } as Prisma.StringFilter,
            }
            : {};
    
    
    const data = await prisma.order.findMany({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        where: {
            ...queryFilter,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
        include: { user: { select: { name: true } } },
    });

    const dataCount = await prisma.order.count();

    return {
        data,
        totalPages: Math.ceil(dataCount/limit),
    };
}

export async function deleteOrder(id: string) {
    try {
        await prisma.order.delete({ where: { id } });

        revalidatePath('/admin/orders');

        return {
            success: true,
            message: 'Ordem excluída com sucesso!',
        };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function updateOrderToPaidCCOD(orderId: string) {
    try {
        await updateOrderToPaid({ orderId });

        revalidatePath(`/order/${orderId}`);

        return {
            success: true,
            message: 'Ordem marcada como paga.'
        }
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function deliverOrder(orderId: string) {
    try {
        const order = await prisma.order.findFirst({
            where: { id: orderId },
        });

        if (!order) throw new Error('Ordem não encontrada.');
        if (!order.isPaid) throw new Error('Ordem não foi paga ainda.');

        await prisma.order.update({
            where: { id: orderId },
            data: {
                isDelivered: true,
                deliveredAt: new Date(),
            },
        });

        revalidatePath(`/order/${orderId}`);

        return {
            success: true,
            message: 'Ordem marcada como entregue.',
        }
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}