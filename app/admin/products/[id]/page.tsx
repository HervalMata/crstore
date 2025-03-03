import {Metadata} from "next";
import {getProductById} from "@/lib/actions/product.actions";
import {notFound} from "next/navigation";
import ProductForm from "@/app/admin/products/product-form";
import { requireAdmin } from '@/lib/auth-guard';

export const metadata: Metadata = {
    title: "Atualizar Produto",
};

const AdminProductUpdatePage = async (props: {
    params: Promise<{
        id: string;
    }>;
}) => {
    await requireAdmin();
    const { id } = await props.params;
    const product = await getProductById(id);

    if (!product) return notFound();

    return (
        <div className='space-y-8 max-w-5xl mx-auto'>
            <h1 className='h2-bold'>Atualizar Produto</h1>
            <ProductForm type= 'Update' product={product} productId={product.id} />
        </div>
    );
};

export default AdminProductUpdatePage;