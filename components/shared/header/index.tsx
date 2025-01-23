import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { ShoppingCart, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ModeToogle from "./mode-toggle";

const Header = () => {
    return (
        <header className="w-full border-b">
            <div className="wrapper flex-between">
                <div className="flex-start">
                    <Link href='/' className="flex-start">
                        <Image
                            priority={true}
                            src='/images/logo.png'
                            width={48}
                            height={48}
                            alt={`${APP_NAME} logo`}
                        />
                        <span className="hidden lg:block font-bold text-2xl ml-3">
                            {APP_NAME}
                        </span>
                    </Link>
                </div>
                <div className="space-x-2">
                    <ModeToogle />
                    <Button asChild variant='ghost'>
                        <Link href='/cart'>
                            <ShoppingCart />
                            Carrinho
                        </Link>
                    </Button>
                    <Button asChild variant='ghost'>
                        <Link href='/sign-in'>
                            <UserIcon />
                            Entrar
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;