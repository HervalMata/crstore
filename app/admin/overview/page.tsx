import {Metadata} from "next";
import {auth} from "@/auth";
import {getOrderSummary} from "@/lib/actions/order.actions";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {BadgeDollarSign, Barcode, CreditCard, Users} from "lucide-react";
import {formatCurrency, formatDateTime, formatNumber} from "@/lib/utils";
import Charts from "@/app/admin/overview/charts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Admin Dashboard",
}

const AdminOverviewPage = async () => {
    const session = await auth();
    
    if (session?.user?.role !== "admin") {
        throw new Error("Usuário não encontrado.");
    }
    
    const summary = await getOrderSummary();
    
    return (
        <div className='space-y-2'>
            <h1 className='h2-bold'>Ordens</h1>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                        <CardTitle className='text-sm font-medium'>
                            Total de Vendas
                        </CardTitle>
                        <BadgeDollarSign />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {formatCurrency(summary.totalSales._sum.totalPrice.toString() || 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                        <CardTitle className='text-sm font-medium'>
                            Vendas
                        </CardTitle>
                        <CreditCard />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {formatNumber(summary.ordersCount)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                        <CardTitle className='text-sm font-medium'>
                            Compradores
                        </CardTitle>
                        <Users />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {formatNumber(summary.usersCount)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                        <CardTitle className='text-sm font-medium'>
                            Produtos
                        </CardTitle>
                        <Barcode />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {formatNumber(summary.productsCount)}
                        </div>
                    </CardContent>
                </Card>
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
                    <Card className='col-span-4'>
                        <CardHeader>
                            <CardTitle>
                                Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <Charts
                                    data={{
                                        salesData: summary.salesData,
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className='col-span-3'>
                        <CardHeader>
                            <CardTitle>Vendas Recentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>COMPRADOR</TableHead>
                                        <TableHead>DATA</TableHead>
                                        <TableHead>TOTAL</TableHead>
                                        <TableHead>AÇÔES</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {summary.latestSales.map(order => (
                                        <TableRow key={order.id}>
                                            <TableCell>{order?.user?.name ? order?.user?.name : 'Usuário Removido'}</TableCell>
                                            <TableCell>{formatDateTime(order.createdAt).dateOnly}</TableCell>
                                            <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                                            <TableCell>
                                                <Link href={`/order/${order.id}`}>
                                                    <span className='px-2'>Detalhes</span>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminOverviewPage;