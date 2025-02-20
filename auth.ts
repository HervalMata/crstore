import NextAuth from "next-auth";
import  type { NextAuthConfig} from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";
import {prisma} from "@/db/prisma";
import CredentialsProvider from 'next-auth/providers/credentials'
import {compare} from "./lib/encrypt";
import { authConfig } from "@/auth.config";

export const config = {
    pages: {
        signIn: '/sign-in',
        error: '/sign-in',
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials: {
                email: {
                    type: 'email',
                },
                password: { type: 'password' },
            },
            async authorize(credentials) {
                if (credentials == null) return null;

                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string,
                    }
                })

                if (user && user.password) {
                    const isMatch = compare(
                        credentials.password as string,
                        user.password,
                    )

                    if (isMatch) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                        }
                    }
                }
                return null;
            }
        })
    ],
    ...authConfig.callbacks,

    session: {
        strategy: 'jwt' as const,

    },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);

