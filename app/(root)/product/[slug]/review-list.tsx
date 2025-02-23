'use client';

import {useState} from "react";
import {Review} from "@/types";
import ReviewForm from "@/app/(root)/product/[slug]/review-form";
import Link from "next/link";

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [reviews, setReviews] = useState<Review[]>([]);

    const reload = () => {
        console.log('Review Submitted');
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
            </div>
        </div>
    );
};

export default ReviewList;