import * as React from 'react';
import {Metadata} from "next";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {APP_NAME} from "@/lib/constants";

export const metadata: Metadata = {
    title: 'Sign In',
}

const SignIn = () => {

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
            </Card>
        </div>
    );
};

export default SignIn;