import {Metadata} from "next";
import {getMyCart} from "@/lib/actions/cart.actions";
import {auth} from "@/auth";
import {getUserById} from "@/lib/actions/user.actions";
import {redirect} from "next/navigation";
import {ShippingAddress} from "@/types";
import CheckoutSteps from "@/components/shared/checkout-steps";
import {Card, CardContent} from "@/components/ui/card";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Image from "next/image";
import {formatCurrency} from "@/lib/utils";
import PlaceOrderForm from "@/app/(root)/place-order/place-order-form";

export const metadata: Metadata = {
    title: "Ordem",
}

const PlaceOrderPage = async () => {
    const cart = await getMyCart();
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) throw new Error("Usuário não encontrado.");
    
    const user = await getUserById(userId);
    
    if (!cart || cart.items.length === 0) redirect('/cart');
    if (!user.address) redirect('/shipping-address');
    if (!user.paymentMethod) redirect('/payment-method')
    
    const userAddress = user.address as ShippingAddress;
    
    
    return (
        <>
            <CheckoutSteps current={3} />
            <h1 className="py-4 text-2xl">Ordem</h1>
            <div className="grid md:grid-cols-3 md:gap-5">
                <div className="md:col-span-2 overflow-x-auto space-y-4">
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="pb-4 text-xl">Endereço de Entrega</h2>
                            <p>{userAddress.fullName}</p>
                            <p>
                                {userAddress.streetAddress}, {userAddress.city}{' '}
                                {userAddress.postalCode}, {userAddress.country}{' '}
                            </p>
                            <div className="mt-3">
                                <Link href='/shipping-address'>
                                    <Button variant='outline'>Editar</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="pb-4 text-xl">Metódos de Pagamento</h2>
                            <p>{user.paymentMethod}</p>
                            <div className="mt-3">
                                <Link href='/payment-method'>
                                    <Button variant='outline'>Editar</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="pb-4 text-xl">Itens da Ordem</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Quantidade</TableHead>
                                        <TableHead>Preço</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cart.items.map((item) => (
                                        <TableRow key={item.slug}>
                                            <TableCell>
                                                <Link href={`/product/{item.slug}`} className='flex items-center'>
                                                    <Image src={item.image} alt={item.name} width={50} height={50} />
                                                    <span className='px-2'>{item.name}</span>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <span className='px-2'>{item.qty}</span>
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                R$ {item.price}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardContent className="p-4 gap-4 space-y-4">
                            <div className="flex justify-between">
                                <div>Itens</div>
                                <div>{formatCurrency(cart.itemsPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Impostos</div>
                                <div>
                                    {
                                        formatCurrency
                                            (cart.taxPrice)
                                    }
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div>Taxa de Entrega</div>
                                <div>{formatCurrency(cart.shippingPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Total</div>
                                <div>{formatCurrency(cart.totalPrice)}</div>
                            </div>
                            <PlaceOrderForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default PlaceOrderPage;