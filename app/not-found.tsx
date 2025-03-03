'use client';

import Image from "next/image";
import {APP_NAME} from "@/lib/constants";
import {Button} from "@/components/ui/button";
import Link from 'next/link';

const NotFound = () => {
   return (
       <div className='flex flex-col items-center justify-center min-h-screen'>
           <Image
               priority={true}
               src='/images/logo.png'
               width={48}
               height={48}
               alt={`$${APP_NAME} logo`}
           />
           <div className='p-6 rounded-lg shadow-md w-1/3 text-center'>
               <h1 className='text-3xl font-bold mb-4'>Não Encontrado</h1>
               <p className='text-destructive'>Não foi possivel encontrar a página solicitada.</p>
               <Button
                variant='outline'
                className='mt-4 ml-2'
                asChild
               >
                 <Link href='/'>Retornar para Home</Link>
               </Button>
           </div>
       </div>
   );
};

export default NotFound;