"use client";

import {Label} from "@/components/ui/label";
import {signInDefaultValues} from "@/lib/constants";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useActionState} from "react";
import {signInWithCredentials} from "@/lib/actions/user.actions";
import {useFormStatus} from "react-dom";

const CredentialsSignInForm = () => {
    const [data, action] = useActionState(signInWithCredentials, {
        message: '',
        success: false,
    });

    const searchParams = new URLSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || '/';

    const SignInButton = () => {
        const { pending } = useFormStatus();

        return (
            <Button
                disabled={pending} className='w-full' variant='default'
            >
                {pending ? 'Entrando em ...' : 'Entrando com credenciais'}
            </Button>
        )
    }

    return (
        <form action={action}>
            <input type='hidden' name='callbackUrl' value={callbackUrl} />
            <div className='space-y-6'>
                <div>
                    <Label htmlFor={'email'}>Email</Label>
                    <input
                        type='email'
                        name='email'
                        id='email'
                        required
                        defaultValue={signInDefaultValues.email}
                        autoComplete='Email'
                    />
                </div>
                <div>
                    <Label htmlFor={'password'}>Senha</Label>
                    <input
                        type='password'
                        name='password'
                        id='password'
                        required
                        defaultValue={signInDefaultValues.password}
                        autoComplete='Senha'
                    />
                </div>
                <div>
                    <SignInButton />
                </div>
                {
                    // @ts-ignore
                    data && !data.success && (
                    // @ts-ignore
                        <div className='text-center text-destructive'>{data.message}</div>
                    )
                }
                <div className='text-sm text-center text-muted-foreground'>
                    Não tem uma conta?{' '}
                    <Link href='/sign-up' target='_self' className='link'>Cadastre-se</Link>
                </div>
            </div>
        </form>
    )
};

export default CredentialsSignInForm;