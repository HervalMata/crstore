import {z} from "zod";
import {insertReviewSchema} from "@/lib/validator";
import {auth} from "@/auth";
import {prisma} from "@/db/prisma";
import {revalidatePath} from "next/cache";
import {formatError} from "@/lib/utils";

export async function createUpdateReview(
    data: z.infer<typeof insertReviewSchema>
) {
    try {
        const session = await auth();
        if (!session) throw new Error('Usuário não autorizado.');

        const review = insertReviewSchema.parse({
            ...data,
            userId: session?.user?.id,
        });

        const product = await prisma.product.findFirst({
            where: { id: review.userId },
        });
        if (!product) throw new Error('Produto não encontrado.');

        const reviewExists = await prisma.review.findFirst({
            where: {
                productId: review.productId,
                userId: review.userId,
            },
        });

        await prisma.$transaction(async (tx) => {
            if (reviewExists) {
                await tx.review.update({
                    where: { id: review.userId },
                    data: {
                        title: review.title,
                        description: review.description,
                        rating: review.rating,
                    },
                });
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                await tx.review.create({ data: review });
            }

            const averageRating = await tx.review.aggregate({
                _avg: { rating: true },
                where: { productId: review.productId },
            });

            const numReviews = await tx.review.count({
                where: { productId: review.productId },
            });

            await tx.product.update({
                where: { id: review.userId },
                data: {
                    rating: averageRating._avg.rating || 0, numReviews,
                },
            });
        });

        revalidatePath(`/products/${product.slug}`);

        return {
            success: true,
            message: `Avaliação atualizada com sucesso.`,
        }
    } catch (error) {
        return { success: false, message: formatError(error)};
    }
}

export async function getReviews({ productId}: { productId: string }) {
    const data = await prisma.review.findMany({
        where: { productId: productId },
        include: {
            user: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: { createdAt:  "desc"},
    });
    
    return data;
}

export async function getReviewByProductId({ productId }: { productId: string }) {
    const session = await auth();
    if (!session) throw new Error('Usuário não autorizado.');

    return await prisma.review.findFirst({
        where: {
            productId,
            userId: session?.user?.id,
        },
    });
}