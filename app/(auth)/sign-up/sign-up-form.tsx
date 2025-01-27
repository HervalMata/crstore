'use client';

import * as React from 'react';
import {useActionState} from "react";
import {signUpUser} from "@/lib/actions/user.actions";
import {useSearchParams} from "next/navigation";
import {useFormStatus} from "react-dom";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {signUpDefaultValues} from "@/lib/constants";
import Link from 'next/link';


const SignUpForm = () => {
    const [data, action] = useActionState(signUpUser, {
        message: '',
        success: false,
    })

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const SignUpButton = () => {
        const { pending } = useFormStatus();

        return (
            <Button disabled={pending} className='w-full' variant='default'>
                {pending ? 'Cadastrando...' : 'Cadastro'}
            </Button>
        );
    };

    // @ts-ignore
    // @ts-ignore
    return (
        <form action={action}>
            <input type='hidden' name='callbackUrl' value={callbackUrl} />

            <div className='space-y-6'>
                <div>
                    <Label htmlFor='name'>Nome</Label>
                    <input
                        id='name'
                        type='text'
                        name='name'
                        autoComplete='Nome'
                        defaultValue={signUpDefaultValues.name}
                    />
                </div>
                <div>
                    <Label htmlFor='email'>Email</Label>
                    <input
                        id='email'
                        type='text'
                        name='email'
                        autoComplete={'Email'}
                        defaultValue={signUpDefaultValues.email}
                    />
                </div>
                <div>
                    <Label htmlFor='password'>Senha</Label>
                    <input
                        id='password'
                        type='password'
                        name='password'
                        required
                        autoComplete={'Senha'}
                        defaultValue={signUpDefaultValues.password}
                    />
                </div>
                <div>
                    <Label htmlFor='confirmPassword'>Confirme a Senha</Label>
                    <input
                        id='confirmPassword'
                        type='confirmPassword'
                        name='confirmPassword'
                        required
                        autoComplete={'Senha'}
                        defaultValue={signUpDefaultValues.confirmPassword}
                    />
                </div>
                <div>
                    <SignUpButton />
                </div>


                {
                    // @ts-ignore
                    data && !data.success && (
                    // @ts-ignore
                    <div className='text-center text-destructive'>{data.message}</div>
                )}

                <div className='text-sm text-center text-muted-foreground'>
                    Já tem uma conta?{' '}
                    <Link href='/sign-in' target='_self' className='link'>
                        Entrar
                    </Link>
                </div>
            </div>
        </form>
    );
};

export default SignUpForm;