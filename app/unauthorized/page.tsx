import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acesso Não Autorizado',
}

export default function UnauthorizedPage() {
    return (
      <div className='container mx-auto flex h-[calc(100vh - 200px)] flex-col items-center justify-center space-y-4'>
        <h1 className='text-4xl h1-bold'>
          Acesso não autorizado
        </h1>
        <p className='text-muted-foreground'>
          Você não tem permissão para acessar esta página.
        </p>
        <Button asChild>
          <Link href='/'>Retornar para a Home</Link>
        </Button>
      </div>
    )
}
