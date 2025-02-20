import {Metadata} from "next";
import {getAllOrders} from "@/lib/actions/order.actions";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {formatCurrency, formatDateTime, formatId} from "@/lib/utils";
import Link from "next/link";
import Pagination from "@/components/shared/pagination";
import {auth} from "@/auth";

export const metadata: Metadata = {
    title: "Ordens",
}

const AdminOrdersPage = async (props: {
    searchParams: Promise<{ page: string }>
}) => {
    const { page = '1' } = await props.searchParams;
    const session = await auth();

    if (session?.user?.role !== "admin") {
        throw new Error("Usuário não encontrado");
    }

    const orders = await getAllOrders({
        page: Number(page),
    });
    console.log(orders);

    return (
        <div className='space-y-2'>
            <h1 className='h2-bold'>Ordens</h1>
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
                                    <Link href={`/order/${order.id}`}>
                                        <span className='px-2'>Detalhes</span>
                                    </Link>
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
