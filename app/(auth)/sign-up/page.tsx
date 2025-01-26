import * as React from 'react';
import {Metadata} from "next";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {APP_NAME} from "@/lib/constants";
import SignUpForm from "@/app/(auth)/sign-up/sign-up-form";

export const metadata: Metadata = {
    title: "Cadastro",
}

const SignUpPage = async (
    props: {
        searchParams: Promise<{ callbackUrl: string }>;
    }
) => {
    const { callbackUrl } = await props.searchParams;
    const session = await auth();

    if (session) {
        return redirect(callbackUrl || '/');
    }

    return (
        <div className='w-full max-w-md mx-auto'>
            <Card>
                <CardHeader className='space-y-4'>
                    <Link href='/' className='flex-center'>
                        <Image src='/images/logo.png' width={100} height={100} alt={`${APP_NAME} logo`} priority={true} />
                    </Link>
                    <CardTitle className='text-center'>Criar Conta</CardTitle>
                    <CardDescription className='text-center'>
                        Entre com suas informações abaixo para se cadastrar
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <SignUpForm />
                </CardContent>
            </Card>
        </div>
    );
};

export default SignUpPage;