import * as React from 'react';
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import ProductPrice from "@/components/shared/product/product-price";
import {Product} from "@/types";
import Rating from "@/components/shared/product/rating";

const ProductCard = ({ product }: { product: Product }) => {
    return (
        <Card className='w-full max-w-sm'>
            <CardHeader className='p-0 items-center'>
                <Link href={`/product/${product.slug}`}>
                    <Image
                        priority={true}
                        src={product.images![0]}
                        alt={product.name}
                        className='aspect-square object-cover rounded'
                        height={300}
                        width={300}
                    />
                </Link>
            </CardHeader>
            <CardContent className='p-4 grid gap-4'>
                <div className='text-xs'>{product.name}</div>
                <Link href={`/product/${product.slug}`}>
                    <h2 className='text-sm font-medium'>{product.name}</h2>
                </Link>
                <div className='flex-between gap-4'>
                    <Rating value={Number(product.rating)} />
                    {product.stock > 0 ? (
                        <ProductPrice value={Number(product.price)} />
                    ) : (
                        <p className='text-destructive'>Fora de Estoque</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCard;