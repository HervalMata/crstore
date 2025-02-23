import ProductList from "@/components/shared/product/product-list";
import {getFeaturedProducts, getLatestProducts} from "@/lib/actions/product.actions";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ViewAllProductsButton from "@/components/view-all-products-button";

const delay = (ms: number | undefined) => new Promise((resolve) => setTimeout(resolve, ms));

const HomePage = async () => {
    const latestProducts = await getLatestProducts();
    const featuredProducts = await getFeaturedProducts();


    await delay(2000);

    return (
        <div className='space-y-8'>
            <h2 className='h2-bold'>Últimos Produtos</h2>
            {featuredProducts.length > 0 && (
                <ProductCarousel data={featuredProducts} />
            )}
            <ProductList title='Produtos Novos' data={latestProducts} />
            <ViewAllProductsButton />
        </div>
    );
};

export default HomePage;