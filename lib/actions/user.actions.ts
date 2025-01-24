'use server';

import {signInFormSchema} from "@/lib/validator";
import {signIn, signOut} from "@/auth";
import {isRedirectError} from "next/dist/client/components/redirect-error";

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