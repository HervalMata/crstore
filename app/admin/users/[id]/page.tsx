import {Metadata} from "next";
import {getUserById} from "@/lib/actions/user.actions";
import {notFound} from "next/navigation";
import UpdateUserForm from "@/app/admin/users/[id]/update-user-form";
import { requireAdmin } from '@/lib/auth-guard';

export const metadata: Metadata = {
    title: "Atualizar Usuários",
};

const AdminUserUpdatePage = async (props: {
    params: Promise<{
        id: string;
    }>;
}) => {
    await requireAdmin();
    const { id } = await props.params;
    const user = await getUserById(id);

    if (!user) return notFound();

    return (
        <div className='space-y-8 max-w-5xl mx-auto'>
            <h1 className='h2-bold'>Atualizar Usuário</h1>
            <UpdateUserForm user={user} />
        </div>
    );
}

export default AdminUserUpdatePage;