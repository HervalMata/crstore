import {Metadata} from "next";
import {deleteOrder, getAllOrders} from "@/lib/actions/order.actions";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {formatCurrency, formatDateTime, formatId} from "@/lib/utils";
import Link from "next/link";
import Pagination from "@/components/shared/pagination";
import {Button} from "@/components/ui/button";
import DeleteDialog from "@/components/shared/delete-dialog";
import { requireAdmin } from '@/lib/auth-guard';

export const metadata: Metadata = {
    title: "Ordens",
}

const AdminOrdersPage = async (props: {
    searchParams: Promise<{ page: string; query: string }>
}) => {
    const { page = '1', query: searchText } = await props.searchParams;
    await requireAdmin();

    const orders = await getAllOrders({
        page: Number(page), query: searchText,
    });
    console.log(orders);

    return (
        <div className='space-y-2'>
            <div className='flex items-center gap-3'>
                <h1 className='h2-bold'>Ordens</h1>
                {searchText && (
                    <div>
                        Filtrados por <i>&qout;{searchText}&qout;</i>{' '}
                        <Link href='/admin/orders'>
                            <Button variant='outline' size='sm'>
                                Remover filtro
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
            <div className='overflow-x-auto'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>DATA</TableHead>
                            <TableHead>TOTAL</TableHead>
                            <TableHead>PAGO</TableHead>
                            <TableHead>ENTREGUE</TableHead>
                            <TableHead>AÇÔES</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.data.map(order => (
                            <TableRow key={order.id}>
                                <TableCell>{formatId(order.id)}</TableCell>
                                <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
                                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                                <TableCell>{order.isPaid && order.paidAt ? formatDateTime(order.paidAt).dateTime : 'A Pagar'}</TableCell>
                                <TableCell>{order.isDelivered && order.deliveredAt ? formatDateTime(order.deliveredAt).dateTime : 'Não Entregue'}</TableCell>
                                <TableCell>
                                    <Button asChild variant='outline' size='sm'>
                                        <Link href={`/order/${order.id}`}>
                                            Detalhes
                                        </Link>
                                    </Button>
                                    <DeleteDialog id={order.id} action={deleteOrder} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {orders.totalPages > 1 && (
                    <Pagination
                        page={Number(page) || 1}
                        totalPages={orders.totalPages}
                    />
                )}
            </div>
        </div>
    );
}

export default AdminOrdersPage;
