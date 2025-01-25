import * as React from 'react';
import {Metadata} from "next";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {APP_NAME} from "@/lib/constants";
import CredentialsSignInForm from "@/app/(auth)/sign-in/credentials-signin-form";
import {auth} from "@/auth";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
    title: 'Sign In',
}

const SignIn = async () => {
    const session = await auth();

    if (session) {
        return redirect('/');
    }

    return (
        <div className='w-full max-w-md mx-auto'>
            <Card>
                <CardHeader className="space-y-4">
                    <Link href='/' className='flex-center'>
                        <Image
                            priority={true}
                            src='/logo.png'
                            width={100}
                            height={100}
                            alt={`${APP_NAME} Logo`}
                        />
                    </Link>
                    <CardTitle className='text-center'>
                        Entrar
                    </CardTitle>
                    <CardDescription className='text-center'>
                        Selecione um método para entrar em sua conta
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <CredentialsSignInForm />
                </CardContent>
            </Card>
        </div>
    );
};

export default SignIn;