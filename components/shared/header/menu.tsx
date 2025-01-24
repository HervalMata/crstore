import * as React from 'react';
import ModeToggle from "@/components/shared/header/mode-toggle";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {EllipsisVertical, ShoppingCart, UserIcon} from "lucide-react";
import {Sheet, SheetContent, SheetTitle, SheetTrigger} from "@/components/ui/sheet";


const Menu = () => {
    return (
        <>
            <div className="flex justify-end gap-3">
                <nav className="md:flex hidden w-full max-w-xs gap-1">
                    <ModeToggle />
                    <Button asChild variant="ghost">
                        <Link href='/cart'>
                            <ShoppingCart />
                            Carrinho
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href='/sign-in'>
                            <UserIcon />
                            Entrar
                        </Link>
                    </Button>
                </nav>
                    <nav className='md:hidden'>
                        <Sheet>
                            <SheetTrigger className='align-middle'>
                                <EllipsisVertical />
                            </SheetTrigger>
                            <SheetContent className='flex flex-col items-start'>
                                <SheetTitle>Menu</SheetTitle>
                                <ModeToggle />
                                <Button asChild variant="ghost">
                                    <Link href='/cart'>
                                        <ShoppingCart />
                                        Carrinho
                                    </Link>
                                </Button>
                                <Button asChild>
                                    <Link href='/sign-in'>
                                        <UserIcon />
                                        Entrar
                                    </Link>
                                </Button>
                            </SheetContent>
                        </Sheet>
                    </nav>
            </div>
        </>
    );
};

export default Menu;