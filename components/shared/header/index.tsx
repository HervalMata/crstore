import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/shared/header/menu";
import CategoryDrawer from "@/components/shared/header/category-drawer";
import Search from "@/components/shared/header/search";

const Header = () => {
    return (
        <header className="w-full border-b">
            <div className="wrapper flex-between">
                <div className="flex-start">
                    <CategoryDrawer />
                    <Link href='/' className="flex-start ml-4">
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
                <div className='hidden md:block'>
                    <Search />
                </div>
                <Menu />
            </div>
        </header>
    );
};

export default Header;