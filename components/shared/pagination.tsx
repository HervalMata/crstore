'use client';

import {useRouter, useSearchParams} from "next/navigation";
import {formatQuery} from "@/lib/utils";
import {Button} from "@/components/ui/button";

type PaginationProps = {
    page: number | string;
    totalPages: number;
    urlParameters?: string;
}

const Pagination = ({ page, totalPages, urlParameters }: PaginationProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleClick = (btnType: string) => {
      const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1;
      const newUrl = formatQuery({
          params: searchParams.toString(),
          key: urlParameters || 'page',
          value: pageValue.toString(),
      });

      router.push(newUrl);
    };

    return (
        <div className="flex gap-2">
            <Button
                size='lg'
                variant='outline'
                className='w-20'
                disabled={Number(page) <= 1}
                onClick={() => handleClick('prev')}
            >
                Anterior
            </Button>
            <Button
                size='lg'
                variant='outline'
                className='w-20'
                disabled={Number(page) >= totalPages}
                onClick={() => handleClick('next')}
            >
                Próximo
            </Button>
        </div>
    );
};

export default Pagination;