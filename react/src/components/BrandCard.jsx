import React from 'react';
import { LazyLoadImage } from "react-lazy-load-image-component";
import { BsArrowRightShort } from "react-icons/bs";

function BrandCard(props) {
    return (
        <div className='h-[22rem] w-60 lg:h-[28rem] lg:w-72 md:mx-5 xl:mx-10 2xl:mx-14 bg-white dark:bg-[#d5d5d5] rounded-3xl shadow-2xl mb-8 transform hover:scale-110 hover:transition ease-out duration-300' >

            <div className='h-[9rem] lg:h-[12rem] rounded-t-3xl shadow-xl  '>
                <LazyLoadImage
                    src={props.brand}
                    alt={props.alt}
                    effect="opacity"
                    placeholderSrc={props.brand}
                    className='rounded-t-3xl h-[9rem] w-60 lg:h-[12rem] lg:w-72' />
            </div>

            <div>
                <h2 className='text-sm xl:text-base font-roboto text-center mt-2 xl:mt-6 px-6'>{props.text}</h2>
            </div>

            <div className='flex items-center justify-center mt-3 xl:mt-6 cursor-pointer'>
                <a href="" className='text-base xl:text-xl flex justify-center hover:border-b-2 border-black'>
                    See more
                    <BsArrowRightShort size={30} className='pt-1 ' /></a>

            </div>

        </div>
    );
}

export default BrandCard;