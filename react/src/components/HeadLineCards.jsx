import React from 'react';
import BrandCard from "./BrandCard";
import adidas from '../assets/images/adidas.jpg';
import newBalance from '../assets/images/NewBalance.jpg';
import nike from '../assets/images/nike.jpg';


function HeadLineCards() {
    return (

        <div className='bg-white dark:bg-black'>


            <h2 className='flex justify-center text-4xl sm:text-5xl xl:text-6xl font-roboto mt-20 '>Explore Our Brands</h2>

            {/* div for cards*/}

            <div className='flex flex-col lg:flex-row justify-center items-center mt-12 xl:mt-20 mb-8'>

                {/* Nike card*/}

                <div className='flex flex-col md:flex-row'>
                    <BrandCard
                        text="Nike shoes are a popular choice for those who value comfort, style, and innovative technology. Nike offers a wide range of shoes for different sports and activities, as well as for everyday wear."
                        brand={nike}
                        alt="Logo Nike" />

                    {/* Adidas card*/}

                    <BrandCard
                        text="Adidas shoes are known for their iconic style, quality, and innovative technology. Adidas offers a wide range of shoes for different sports and activities, as well as for everyday wear."
                        brand={adidas}
                        alt="Logo Adidas" />

                    {/* New Balance card*/}
                </div>
                <div className='flex'>
                    <BrandCard
                        text="New Balance shoes are renowned for their comfort, durability, and innovative design. New Balance offers a wide range of shoes for various sports and activities, as well as for everyday wear."
                        brand={newBalance}
                        alt="Logo New balance" />
                </div>

            </div>
        </div >
    );
}

export default HeadLineCards;