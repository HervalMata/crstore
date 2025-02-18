'use client';

import {Order} from "@/types";
import {formatCurrency, formatId, formatDateTime} from "@/lib/utils";
import {Card, CardContent} from "@/components/ui/card";
import Link from "next/link";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Image from "next/image";
import PlaceOrderForm from "@/app/(root)/place-order/place-order-form";
import {Badge} from "@/components/ui/badge";

const OrderDetailsTable = ({ order }: { order: Order }) => {
  const {
      id, shippingAddress, orderItems, itemsPrice, shippingPrice,
      taxPrice, totalPrice, paymentMethod, isDelivered, isPaid,
      paidAt, deliveredAt,
  } = order;

  return (
      <>
          <h1 className="py-4 text-2xl">Ordem {formatId(id)}</h1>
          <div className="grid md:grid-cols-3 md:gap-5">
              <div className="col-span-2 overflow-x-auto space-y-4">
                  <Card>
                      <CardContent className="p-4 gap-4">
                          <h2 className="pb-4 text-xl">Metódos de Pagamento</h2>
                          <p className='mb-2'>{paymentMethod}</p>
                          {isPaid ? (
                              <Badge variant='secondary'>
                                  Pago em {formatDateTime(paidAt!).dateTime}
                              </Badge>
                          ) : (
                              <Badge variant='destructive'>A Pagar</Badge>
                          )}
                      </CardContent>
                  </Card>

                  <Card>
                      <CardContent className="p-4 gap-4">
                          <h2 className="pb-4 text-xl">Endereço de Entrega</h2>
                          <p>{shippingAddress.fullName}</p>
                          <p>
                              {shippingAddress.streetAddress}, {shippingAddress.city}{' '}
                              {shippingAddress.postalCode}, {shippingAddress.country}{' '}
                          </p>
                          {isDelivered ? (
                              <Badge variant='secondary'>
                                  Pago em {formatDateTime(deliveredAt!).dateTime}
                              </Badge>
                          ) : (
                              <Badge variant='destructive'>A Entregar</Badge>
                          )}
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
                                  {orderItems.map((item) => (
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
                              <div>{formatCurrency(itemsPrice)}</div>
                          </div>
                          <div className="flex justify-between">
                              <div>Impostos</div>
                              <div>
                                  {
                                      formatCurrency
                                          (taxPrice)
                                  }
                              </div>
                          </div>
                          <div className="flex justify-between">
                              <div>Taxa de Entrega</div>
                              <div>{formatCurrency(shippingPrice)}</div>
                          </div>
                          <div className="flex justify-between">
                              <div>Total</div>
                              <div>{formatCurrency(totalPrice)}</div>
                          </div>
                          <PlaceOrderForm />
                      </CardContent>
                  </Card>
              </div>
          </div>
      </>
  )
}

export default OrderDetailsTable;