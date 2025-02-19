'use client';

import React from "react";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";
import Link from "next/link";

const links = [
    {
        title: 'Perfil',
        href: '/user/profile',
    },
    {
        title: 'Ordens',
        href: '/user/orders',
    },
];

const MainNav = ({
    className,
    ...props
} : React.HTMLAttributes<HTMLElement>) => {
    const pathname = usePathname();

    return (
        <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
            {links.map((item) => (
                <Link
                    href={item.href}
                    key={item.href}
                    className={cn('text-sm font-medium transition-colors hover:text-primary', pathname.includes(item.href) ? '' : 'text-muted-foreground')}>
                    {item.title}
                </Link>

            ))}
        </nav>
    );
};

export default MainNav;