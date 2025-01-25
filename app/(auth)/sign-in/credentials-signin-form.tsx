import {Label} from "@/components/ui/label";
import {signInDefaultValues} from "@/lib/constants";
import {Button} from "@/components/ui/button";
import Link from "next/link";

const CredentialsSignInForm = () => {
    return (
        <form>
            <div className='space-y-6'>
                <div>
                    <Label htmlFor={'email'}>Email</Label>
                    <input
                        type='email'
                        name='email'
                        id='email'
                        required
                        defaultValue={signInDefaultValues.email}
                        autoComplete='Email'
                    />
                </div>
                <div>
                    <Label htmlFor={'password'}>Senha</Label>
                    <input
                        type='password'
                        name='password'
                        id='password'
                        required
                        defaultValue={signInDefaultValues.password}
                        autoComplete='Senha'
                    />
                </div>
                <div>
                    <Button className='w-full' variant='default'>
                        Entrar
                    </Button>
                </div>
                <div className='text-sm text-center text-muted-foreground'>
                    Não tem uma conta?{' '}
                    <Link href='/sign-up' target='_self' className='link'>Cadastre-se</Link>
                </div>
            </div>
        </form>
    )
};

export default CredentialsSignInForm;