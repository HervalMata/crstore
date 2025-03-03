import {Metadata} from "next";
import ProductForm from "@/app/admin/products/product-form";
import { requireAdmin } from '@/lib/auth-guard';

export const metadata: Metadata = {
    title: "Cadastro de Produtos",
}

const CreateProductPage = async () => {
    await requireAdmin();

    return (
        <>
            <h2 className="h2-bold">Cadastrar novo produto</h2>

            <div className="my-8">
                <ProductForm type='Create' />
            </div>
        </>
    );
}

export default CreateProductPage;