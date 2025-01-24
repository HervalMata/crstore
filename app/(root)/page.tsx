import ProductList from "@/components/shared/product/product-list";
import {getLatestProducts} from "@/lib/actions/product.actions";

const delay = (ms: number | undefined) => new Promise((resolve) => setTimeout(resolve, ms));

const HomePage = async () => {
    const latestProducts = await getLatestProducts();
    await delay(2000);

    return (
        <div className='space-y-8'>
            <h2 className='h2-bold'>Últimos Produtos</h2>
            <ProductList title='Produtos Novos' data={latestProducts} />
        </div>
    );
};

export default HomePage;