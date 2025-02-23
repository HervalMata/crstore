'use client';

import {useEffect, useState} from "react";
import {Review} from "@/types";
import ReviewForm from "@/app/(root)/product/[slug]/review-form";
import Link from "next/link";
import {getReviews} from "@/lib/actions/review.actions";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Rating from "@/components/shared/product/rating";
import {Calendar, User} from "lucide-react";
import {formatDateTime} from "@/lib/utils";

const ReviewList = (
    {
        userId,
        productId,
        productSlug,
    }: {
        userId: string;
        productId: string;
        productSlug: string;
    }
) => {
    
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const loadReviews = async () => {
          const res = await getReviews({ productId });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
            setReviews(res.data);
        }
    }, [productId]);

    const reload = async () => {
        const res = await getReviews({ productId });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setReviews([...res.data]);
    };

    return (
        <div className="space-y-4">
            {reviews.length === 0 && <div>Nenhuma avaliação ainda</div>}
            {userId ? (
                <ReviewForm userId={userId} productId={productId} onReviewSubmitted={reload} />
            ) : (
                <div>
                    Por favor
                    <Link
                        className='text-pink-500 px-2'
                        href={`/sign-in?callback=product//${productSlug}`}>
                        Entrar
                    </Link>
                    Para fazer uma avaliação
                </div>
            )}
            <div className="flex flex-col gap-3">
                {/* REVIEWS HERE */}
                {reviews.map((review) => (
                    <Card key={review.id}>
                        <CardHeader>
                            <div className="flex-between">
                                <CardTitle>{review.title}</CardTitle>
                            </div>
                            <CardDescription>{review.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex space-x-4 text-sm text-muted-foreground">
                                <Rating value={review.rating} />
                                <div className='flex items-center'>
                                    <User className='mr-1 h-3 w-3' />
                                    {review.user ? review.user.name : 'Usuário'}
                                </div>
                                <div className="flex items-center">
                                    <Calendar className='mr-1 h-3 w-3' />
                                    {formatDateTime(review.createdAt).dateTime}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ReviewList;