import {deleteProduct, getAllProducts} from "@/lib/actions/product.actions";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {formatCurrency, formatId} from "@/lib/utils";
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { requireAdmin } from '@/lib/auth-guard';

const AdminProductsPage = async (props: {
    searchParams: Promise<{
        page: string;
        query: string;
        category: string;
    }>;
}) => {
    await requireAdmin();
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1;
    const searchText = searchParams.query || '';
    const category = searchParams.category || '';

    const products = await getAllProducts({
        query: searchText,
        page,
        category,
    });

    return(
        <div className='space-y-2'>
            <div className='flex-between'>
                <div className='flex items-center gap-3'>
                    <h1 className='h2-bold'>Produtos</h1>
                    {searchText && (
                        <div>
                            Filtrados por <i>&qout;{searchText}&qout;</i>{' '}
                            <Link href='/admin/products'>
                                <Button variant='outline' size='sm'>
                                    Remover filtro
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
                <Button asChild variant='default'>
                    <Link href='/admin/products/create'>Cadastrar Produto</Link>
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>NOME</TableHead>
                        <TableHead className='text-right'>PREÇO</TableHead>
                        <TableHead>CATEGORIA</TableHead>
                        <TableHead>ESTOQUE</TableHead>
                        <TableHead>AVALIAÇÔES</TableHead>
                        <TableHead className='w-[100px]'>AÇÔES</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.data.map(product => (
                        <TableRow key={product.id}>
                            <TableCell>{formatId(product.id)}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell className='text-right'>{formatCurrency(product.price)}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>{product.rating}</TableCell>
                            <TableCell className='flex gap-1'>
                                <Button asChild variant='outline' size='sm'>
                                    <Link href={`/admin/products/${product.id}`}>Editar</Link>
                                </Button>
                                <DeleteDialog id={product.id} action={deleteProduct} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {products?.totalPages > 1 && (
                <Pagination page={page} totalPages={products.totalPages} />
            )}
        </div>
    );
}

export default AdminProductsPage;