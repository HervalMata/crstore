import {Order} from "@/types";
import {
    Body,
    Column,
    Container,
    Head,
    Heading,
    Html, Img,
    Preview,
    Row,
    Section,
    Tailwind,
    Text
} from "@react-email/components";
import {formatCurrency} from "@/lib/utils";
import sampleData from "@/db/sample-data";

PurchaseReceiptEmail.PreviewProps = {
    order: {
        id: crypto.randomUUID(),
        userId: '123',
        user: {
            name: 'John Doe',
            email: 'john@example.com',
        },
        paymentMethod: 'Stripe',
        shippingAddress: {
            fullName: 'John Doe',
            streetAddress: '123 Main st',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '1001',
            country: 'Canada',
        },
        createdAt: new Date(),
        totalPrice: '100',
        taxPrice: '10',
        shippingPrice: '10',
        itemsPrice: '80',
        orderItems: sampleData.products.map((x) => ({
            name: x.name,
            orderId: '123',
            productId: '123',
            slug: x.slug,
            qty: x.stock,
            image: x.images[0],
            price: x.price.toString(),
        })),
        isDelivered: true,
        deliveredAt: new Date(),
        isPaid: true,
        paidAt: new Date(),
        paymentResult: {
            id: '123',
            status: 'COMPLETED',
            pricePaid: '100',
            email_address: 'john@example.com',
        },
    },
} satisfies OrderInformationProps;

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' });

type OrderInformationProps = {
    order: Order;
}

export default function PurchaseReceiptEmail(
    {
        order
    }: OrderInformationProps
    ) {
    return (
        <Html>
            <Preview>Veja ordens recebidas</Preview>
            <Tailwind>
                <Head />
                <Body className='font-sans bg-white'>
                    <Container className='max-w-xl'>
                        <Heading>Pagamentos efetuados</Heading>
                        <Section>
                            <Row>
                                <Column>
                                    <Text className='mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap'>
                                        ID da Ordem
                                    </Text>
                                    <Text className='mt-0 mr-4'>
                                        {order.id.toString()}
                                    </Text>
                                </Column>
                                <Column>
                                    <Text className='mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap'>
                                        Data da compra
                                    </Text>
                                    <Text className='mt-0 mr-4'>
                                        {dateFormatter.format(order.createdAt)}
                                    </Text>
                                </Column>
                                <Column>
                                    <Text className='mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap'>
                                        Valor Pago
                                    </Text>
                                    <Text className='mt-0 mr-4'>
                                        {formatCurrency(order.totalPrice)}
                                    </Text>
                                </Column>
                            </Row>
                        </Section>
                        <Section className='border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4'>
                            {order.orderItems.map((item) => (
                                <Row key={item.productId} className='mt-8'>
                                    <Column className='w-20'>
                                        <Img
                                            width='80'
                                            alt={item.name}
                                            className='rounded'
                                            src={
                                                item.image.startsWith('/')
                                                ? `${process.env.NEX_PUBLIC_SERVER_URL}${item.image}`
                                                    : item.image
                                            }
                                        />
                                    </Column>
                                    <Column className='align-top'>
                                        {item.name} x {item.qty}
                                    </Column>
                                    <Column align='right' className='align-top'>
                                        {formatCurrency(item.price)}
                                    </Column>
                                </Row>
                            ))}
                            {[
                                { name: 'Itens', price: order.itemsPrice },
                                { name: 'Impostos', price: order.taxPrice },
                                { name: 'Taxa de Entrega', price: order.shippingPrice },
                                { name: 'Total', price: order.totalPrice },
                            ].map(({ name, price }) => (
                                <Row key={name} className='py-1'>
                                    <Column align='right'>{name}: </Column>
                                    <Column align='right' width={70} className='align-top'>
                                        <Text className='m-0'>{formatCurrency(price)}</Text>
                                    </Column>
                                </Row>
                            ))}
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}