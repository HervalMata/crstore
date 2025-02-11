'use server';

import {signInFormSchema, signUpFormSchema} from "@/lib/validator";
import {signIn, signOut} from "@/auth";
import {isRedirectError} from "next/dist/client/components/redirect-error";
import {hashSync} from "bcrypt-ts-edge";
import {prisma} from "@/db/prisma";
import {formatError} from "@/lib/utils";

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

        user.password = hashSync(user.password, 10);

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