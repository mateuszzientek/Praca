import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../elements/ThemeContext';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { ref, getDownloadURL } from "firebase/storage";
import { useTranslation } from 'react-i18next';
import storage from '../../firebase';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface Shoe {
    _id: string;
    name: string;
    category: string;
    price: number;
    discountPrice: number;
    image: string;
    imageUrl?: string; // Dodane pole imageUrl
    isHearted: boolean; // Dodane pole isHearted
}

interface ProductTemplateProps {
    shoe: Shoe,
    isHearted: boolean
    imageUrl: string
    discountPrice: number,
    price: number
    name: string,
    category: string
    handleHeartClick: (shoe: Shoe) => void
}

function ProductTemplate(props: ProductTemplateProps) {

    const { t } = useTranslation();
    const { theme, setTheme } = useContext(ThemeContext);
    const currentCode = localStorage.getItem('i18nextLng')

    const convertPriceToPLN = (priceUSD: number) => {
        const exchangeRateUSDToPLN = 4.08;
        const pricePLN = priceUSD * exchangeRateUSDToPLN;
        const roundedPricePLN = Math.round(pricePLN / 5) * 5; // Zaokrąglenie do najbliższej liczby kończącej się na 5 lub 0
        return roundedPricePLN;
    }


    return (
        <>
            <div className='w-[15rem] h-[20rem] rounded-lg shadow-xl cursor-pointer hover:scale-105 transform ease-in-out duration-500 '>
                <div className='flex relative items-center justify-center bg-[#fafafa] dark:bg-black/50 w-full h-[70%] rounded-t-lg border-[1px] border-black/10 dark:border-white/20  '>
                    <div onClick={() => props.handleHeartClick(props.shoe)}>
                        {props.isHearted ? (
                            <AiFillHeart size={25} color={"#f54e4e"} className='absolute top-4 right-4 cursor-pointer' />
                        ) : (
                            <AiOutlineHeart size={25} color={theme === 'dark' ? "white" : "black"} className='absolute top-4 right-4 cursor-pointer' />
                        )}
                    </div>
                    <div className='mr-4 mt-6'>
                        <LazyLoadImage
                            src={props.imageUrl}
                            alt="Photo of shoes"
                            effect="blur"
                            placeholderSrc={props.imageUrl}
                            className='scale-75 -rotate-17 ' />
                    </div>
                </div>

                <div className='flex flex-col bg-white dark:bg-black/60 w-full font-lato h-[30%] rounded-b-lg justify-center space-y-1 pl-3'>
                    <p className='text-sm text-black/50 dark:text-white/50'>{t(`categoryShoes.${props.category}`)}</p>
                    <p className='text-base text-black dark:text-white'>{props.name}</p>
                    <div className='flex items-center text-black/50 font-lato space-x-2'>
                        {props.discountPrice !== 0 && (<p className='line-through text-black dark:text-white'>{currentCode !== 'pl' ? t('currencySymbol') : ""}{currentCode === 'pl' ? convertPriceToPLN(props.discountPrice) : props.discountPrice + ",00"} {currentCode === 'pl' ? t('currencySymbol') : ""}</p>)}
                        <p className='text-black dark:text-white font-bold pr-4'>{currentCode !== 'pl' ? t('currencySymbol') : ""}{currentCode === 'pl' ? convertPriceToPLN(props.price) : props.price + ",00"} {currentCode === 'pl' ? t('currencySymbol') : ""}</p>
                    </div>
                </div>

            </div>

        </>
    );
}

export default ProductTemplate;