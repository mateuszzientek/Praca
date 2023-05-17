import React from 'react';
import { useTranslation } from "react-i18next";
import BrandCard from "./BrandCard";
import adidas from '../assets/images/adidas.jpg';
import newBalance from '../assets/images/NewBalance.jpg';
import nike from '../assets/images/nike.jpg';


function HeadLineCards() {
    const { t } = useTranslation()

    return (

        <div className='bg-white dark:bg-[#101010]'>


            <h2 className='flex justify-center text-4xl text-black dark:text-white sm:text-5xl xl:text-7xl font-roboto pt-20 '>{t('headlineCards.main')}</h2>

            {/* div for cards*/}

            <div className='flex flex-col lg:flex-row justify-center items-center mt-12 xl:mt-20'>

                {/* Nike card*/}

                <div className='flex flex-col md:flex-row'>
                    <BrandCard
                        text={t('headlineCards.text-nike')}
                        brand={nike}
                        alt="Logo Nike" />

                    {/* Adidas card*/}

                    <BrandCard
                        text={t('headlineCards.text-adidas')}
                        brand={adidas}
                        alt="Logo Adidas" />

                    {/* New Balance card*/}
                </div>
                <div className='flex'>
                    <BrandCard
                        text={t('headlineCards.text-newbalance')}
                        brand={newBalance}
                        alt="Logo New balance" />
                </div>

            </div>
        </div >
    );
}

export default HeadLineCards;