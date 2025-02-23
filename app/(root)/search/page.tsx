import {getAllCategories, getAllProducts} from "@/lib/actions/product.actions";
import ProductCard from "@/components/shared/product/product-card";
import Link from "next/link";

const prices = [
    {
        name: 'R$1 para R$50',
        value: '1-50',
    },
    {
        name: 'R$51 para R$100',
        value: '51-100',
    },
    {
        name: 'R$101 para R$200',
        value: '101-200',
    },
    {
        name: 'R$201 para R$500',
        value: '201-500',
    },
    {
        name: 'R$501 para R$1000',
        value: '501-1000',
    },
];

const SearchPage = async (props: {
    searchParams: Promise<{
        q?: string;
        category?: string;
        price?: string;
        rating?: string;
        sort?: string;
        page?: string;
    }>;
}) => {
    const {
        q = 'all',
        category = 'all',
        price = 'all',
        rating = 'all',
        sort = 'newest',
        page = 1  } = await props.searchParams;
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getFilterUrl = ({
        c,
        p,
        s,
        r,
        pg,
    }: {
        c?: string;
        p?: string;
        s?: string;
        r?: string;
        pg?: string;
    }) => {
        const params = { q, category, price, rating, sort, page };
        if (c) params.category = c;
        if (p) params.price = p;
        if (s) params.sort = s;
        if (r) params.rating = r;
        if (pg) params.page = pg;
        
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return `/search?${new URLSearchParams(params).toString()}`;
    };

    
    const products = await getAllProducts({
        query: q,
        category,
        price,
        rating,
        sort,
        page: Number(page),
    });

    const categories = await getAllCategories();

    return (
        <div className='grid md:grid-cols-5 md:gap-5'>
            <div className='filter-links'>
                {/* FILTERS */}
                <div className='text-xl mb-2 mt-3'>Categories</div>
                <div>
                    <ul className='space-y-1'>
                        <li>
                            <Link
                                className={`${(category === 'all' || category === '') && 'font-bold'}}`}
                                href={getFilterUrl({ c: 'all' })}>
                                Algum
                            </Link>
                        </li>
                        {categories.map((x) => (
                            <li key={x.category}>
                                <Link className={`${(category === x.category || category === '') && 'font-bold'}}`}
                                      href={getFilterUrl({ c: x.category })}>
                                    {x.category}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='text-xl mb-2 mt-3'>Preço</div>
                <div>
                    <ul className='space-y-1'>
                        <li>
                            <Link
                                className={`${(price === 'all' || price === '') && 'font-bold'}}`}
                                href={getFilterUrl({ p: 'all' })}>
                                Algum
                            </Link>
                        </li>
                        {prices.map((p) => (
                            <li key={p.value}>
                                <Link className={`${(price === p.value || price === '') && 'font-bold'}}`}
                                      href={getFilterUrl({ p: p.value })}>
                                    {p.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className='md:col-span-4 space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    {products.data.length === 0 && <div>Nenhum Produto</div>}
                    {products.data.map(product => (
                        <ProductCard product={product} key={product.id} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;