import ProductList from "@/components/shared/product/product-list";
import sampleData from "@/db/sample-data";

const delay = (ms: number | undefined) => new Promise((resolve) => setTimeout(resolve, ms));

const HomePage = async () => {
  await delay(2000);
  return (
      <div className='space-y-8'>
        <h2 className='h2-bold'>Últimos Produtos</h2>
        <ProductList title='Produtos Novos' data={sampleData.products} limit={4} />
      </div>
  )
}

export default HomePage;