import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useTranslation } from "react-i18next";
import { formatPrice } from 'src/currencyUtils';


interface CartProductTemplateProps {
    imageUrl: string
    name: string;
    brand: string
    cartSize: string
    cartQuantity: number
    price: number
}

function CheckoutProductTemplate(props: CartProductTemplateProps) {
    const { t } = useTranslation();

    const shoePrice = props.price * props.cartQuantity

    return (
        <div className='relative flex w-full items-center mb-6'>
            <LazyLoadImage
                src={props.imageUrl}
                alt="Photo of shoes"
                effect="blur"
                placeholderSrc={props.imageUrl}
                className=' w-[6rem] -rotate-17' />

            <div className='ml-6'>
                <p className='text-lg text-black dark:text-white '>{props.brand}</p>
                <p className='text-lg mt-2 text-black/60 dark:text-white/60  '>{props.name}</p>

                <div className='flex items-center mt-3 space-x-4'>
                    <p className='text-lg text-black/60 dark:text-white/60 '>{t("checkout.text21")} <span className='text-black  dark:text-white'>{props.cartSize}</span></p>
                    <p className='text-lg text-black/60 dark:text-white/60 '>{t("checkout.text22")} <span className='text-black dark:text-white'>{props.cartQuantity}</span></p>
                </div>

            </div>

            <p className='text-lg text-black dark:text-white font-bold absolute top-0 right-0'>{formatPrice(shoePrice, t)}</p>
        </div>
    );
}

export default CheckoutProductTemplate;