import {Metadata} from "next";
import ProductForm from "@/app/admin/products/product-form";

export const metadata: Metadata = {
    title: "Cadastro de Produtos",
}

const CreateProductPage = () => {

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