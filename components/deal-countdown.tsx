'use client';

import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const TARGET_DATE = new Date('2025-11-20T00:00:00');

const calculateTimeRemaining = (targetDate: Date) => {
    const currentTime = new Date();
    const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0);

    return {
        days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(timeDifference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)),
        minutes: Math.floor(timeDifference % (1000 * 60 * 60) / (1000 * 60)),
        seconds: Math.floor(timeDifference % (1000 * 60) / 1000),
    };
};

const DealCountdown = () => {
    const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>();

    useEffect(() => {
        setTime(calculateTimeRemaining(TARGET_DATE));

        const timeInterval = setInterval(() => {
            const newTime = calculateTimeRemaining(TARGET_DATE);
            setTime(newTime);

            if (
                newTime.days === 0 &&
                    newTime.hours === 0 &&
                    newTime.minutes === 0 &&
                    newTime.minutes === 0
            ) {
                clearInterval(timeInterval);
            }
        }, 1000);

        return () => clearInterval(timeInterval);
    }, []);

    if (!time) {
        return (
            <section className='grid grid-cols-1 md:grid-cols-2 my-20'>
                <div className='flex flex-col gap-2 justify-center'>
                    <h3 className='text-3xl font-bold'>Carregando contador...</h3>
                </div>
            </section>
        );
    }

    if (
        time.days === 0 &&
        time.hours === 0 &&
        time.minutes === 0 &&
        time.seconds === 0
    ) {
        return (
            <section className='grid grid-cols-1 md:grid-cols-2 my-20'>
                <div className='flex flex-col gap-2 justify-center'>
                    <h3 className='text-3xl font-bold'>Ofertas encerradas</h3>
                    <p>
                        Esta oferta não está mais dísponível.Check nossas outras promoções!
                    </p>
                    <div className='text-center'>
                        <Button asChild>
                            <Link href='/search'>Veja Produtos</Link>
                        </Button>
                    </div>
                    <div className='flex justify-center'>
                        <Image
                            src='/images/promo.jpg'
                            alt='promoção'
                            width={300}
                            height={200}
                        />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className='grid grid-cols-1 md:grid-cols-2 my-20'>
            <div className='flex flex-col gap-2 justify-center'>
                <h3 className='text-3xl font-bold'>Ofertas do Mês</h3>
                <p>
                    Esteja pronto para uma experiência de compras como nunca antes visto
                    com as oferta do mês! Cada compra com exclusivas ofertas,
                    que faremos neste mês uma celebração das melhores escolhas e maravilhosas ofertas.
                    Não perca! 🎁🛒
                </p>
                <ul className='grid grid-cols-4'>
                    <StatBox label='Dias' value={time.days} />
                    <StatBox label='Horas' value={time.hours} />
                    <StatBox label='Minutos' value={time.minutes} />
                    <StatBox label='Segundos' value={time.seconds} />
                </ul>
                <div className='text-center'>
                    <Button asChild>
                        <Link href='/search'>Veja Produtos</Link>
                    </Button>
                </div>
                <div className='flex justify-center'>
                    <Image
                        src='/images/promo.jpg'
                        alt='promoção'
                        width={300}
                        height={200}
                    />
                </div>
            </div>
        </section>
    );
};

const StatBox = ({ label, value }: { label: string, value: number}) =>(
    <li className='p-4 w-full text-center'>
        <p className='text-3xl font-bold'>{value}</p>
        <p>{label}</p>
    </li>
);

export default DealCountdown;