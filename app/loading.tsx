import * as React from 'react';
import Image from "next/image";
import loader from '@/assets/loader.gif';

const Loading = () => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%',
            }}
        >
            <Image src={loader} width={150} height={150} alt='Carregando...' />
        </div>
    );
};

export default Loading;