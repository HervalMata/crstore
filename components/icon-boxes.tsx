import {Card, CardContent} from "@/components/ui/card";
import {DollarSign, Headset, ShoppingBag, WalletCards} from "lucide-react";

const IconBoxes = () => {
    return (
        <div>
            <Card>
                <CardContent className='grid md:grid-cols-4 gap-4 p-4'>
                    <div className='space-y-2'>
                        <ShoppingBag />
                        <div className='text-sm font-bold'>
                            Entrega Grátis
                        </div>
                        <div className='text-sm text-muted-foreground'>
                            Entrega Grátis em compras acima de R$ 100,00
                        </div>
                    </div>
                    <div className='space-y-2'>
                        <DollarSign />
                        <div className='text-sm font-bold'>
                            Garantia de devolução de dinheiro
                        </div>
                        <div className='text-sm text-muted-foreground'>
                            Até 30 dias após a sua compra
                        </div>
                    </div>
                    <div className='space-y-2'>
                        <WalletCards />
                        <div className='text-sm font-bold'>
                            Pagamentos flexiveis
                        </div>
                        <div className='text-sm text-muted-foreground'>
                            Pague com cartão de crédito, PayPal ou em dinheiro na entrega
                        </div>
                    </div>
                    <div className='space-y-2'>
                        <Headset />
                        <div className='text-sm font-bold'>
                            Suporte 24/7
                        </div>
                        <div className='text-sm text-muted-foreground'>
                            Tenha suporte à qualquer hora
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default IconBoxes;