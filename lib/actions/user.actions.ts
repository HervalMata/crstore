'use server';

import {
    paymentMethodSchema,
    shippingAddressSchema,
    signInFormSchema,
    signUpFormSchema,
    updateUserSchema
} from "@/lib/validator";
import {auth, signIn, signOut} from "@/auth";
import {isRedirectError} from "next/dist/client/components/redirect-error";
import {prisma} from "@/db/prisma";
import {formatError} from "@/lib/utils";
import {ShippingAddress} from "@/types";
import {z} from "zod";
import {getMyCart} from "@/lib/actions/cart.actions";
import { hash } from "../encrypt";
import {PAGE_SIZE} from "@/lib/constants";
import {revalidatePath} from "next/cache";

export async function signInWithCredentials(
    prevState: unknown,
    formData: FormData,
) {
    try {
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password'),
        });

        await signIn('credentials', user);

        return { success: true, message: 'Logados com sucesso!' };
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        return { success: false, message: 'Email ou senha incorretos!' };
    }
}

export async function signOutUser() {
    const currentCart = await getMyCart();

    if (currentCart?.id) {
        await prisma.cart.delete({
            where: { id: currentCart.id },
        });
    } else {
        console.warn('Nenhum carrinho encontrado para remoção.')
    }
    await signOut();
}

export async function signUpUser(prevState: unknown, formData: FormData) {
    try {
        const user = signUpFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        });

        const plainPassword = user.password;

        user.password = await hash(user.password);

        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
            },
        });

        await signIn('credentials', {
            email: user.email,
            password: plainPassword,
        });

        return { success: true, message: 'Usuário cadastre com sucesso!' };
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        return { success: false, message: formatError(error) };
    }
}

export async function getUserById(userId: string) {
    const user = await prisma.user.findFirst({
        where: { id: userId },
    });

    if (!user) throw new Error(`Usuário com ID ${userId} não encontrado.`);

    return user;
}

export async function updateUserAddress(data: ShippingAddress) {
    try {
        const session = await auth();

        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id },
        });

        if (!currentUser) throw new Error('Usuário não encontrado.');

        const address = shippingAddressSchema.parse(data);

        await prisma.user.update({
            where: { id: currentUser.id },
            data: { address },
        });

        return {
            success: true,
            message: 'Usuário atualizado com sucesso!',
        };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function updateUserPaymentMethod(data: z.infer<typeof paymentMethodSchema>) {
    try {
        const session = await auth();

        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id },
        });

        if (!currentUser) throw new Error('Usuário não encontrado.');

        const paymentMethod = paymentMethodSchema.parse(data);

        await prisma.user.update({
            where: { id: currentUser.id },
            data: { paymentMethod: paymentMethod.type },
        });

        return {
            success: true,
            message: 'Usuário atualizado com sucesso!',
        };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function updateProfile(user: { name: string; email: string }) {
    try {
        const session = await auth();

        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id },
        });

        if (!currentUser) throw new Error('Usuário não encontrado.');

        await prisma.user.update({
            where: { id: currentUser.id },
            data: { name: user.name },
        });

        return {
            success: true,
            message: 'Usuário atualizado com sucesso!',
        };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function getAllUsers({
    limit = PAGE_SIZE,
    page,
} : {
    limit?: number;
    page: number;
}) {
    const data = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page -1) * limit,
    });

    const dataCount = await prisma.user.count();

    return {
        data,
        totalPages: Math.ceil(dataCount / page),
    };
}

export async function deleteUser(id: string) {
    try {
        await prisma.user.delete({
            where: { id: id },
        });

        revalidatePath('/admin/users');

        return {
            success: true,
            message: 'Usuário removido com sucesso!',
        };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function updateUser(user: z.infer<typeof updateUserSchema>) {
    try {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                name: user.name,
                role: user.role,
            }
        });

        revalidatePath('/admin/users');

        return {
            success: true,
            message: 'Usuário atualizado com sucesso!',
        };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}