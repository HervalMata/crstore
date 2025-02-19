import {Metadata} from "next";
import {getMyOrders} from "@/lib/actions/order.actions";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {formatCurrency, formatDateTime, formatId} from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Minhas Ordens",
}

const OrdersPage = async (props: {
    searchParams: Promise<{ page: string }>
}) => {
    const { page } = await props.searchParams;
    const orders = await getMyOrders({
        page: Number(page) || 1,
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
                                        <span className='px-2'>Detalhea</span>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default OrdersPage;