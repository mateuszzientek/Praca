import React, { useState } from 'react';
import ScrollToTop from "react-scroll-up";
import ShopInfo from './ShopInfo';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { AiOutlineArrowUp } from "react-icons/ai";
import { TbTruckDelivery, TbCoins, TbTruckReturn } from "react-icons/tb";
import { HiOutlinePaintBrush } from "react-icons/hi2";
import { BsArrowRightShort } from "react-icons/bs";
import blazer from '../assets/images/blazer.png';
import blazers from '../assets/images/blazers.png';




const MainHome = () => {
    return (

        <div>
            <ScrollToTop showUnder={800} duration={700} >
                <div className='bg-[#97DEFF] rounded-full p-2 shadow-button transform hover:scale-125 hover:bg-[#48c5fe] transition ease-out duration-300'>
                    <AiOutlineArrowUp size={25} />
                </div>
            </ScrollToTop>
            <div className='flex flex-col md:flex-row md:justify-center items-center md:items-start  h-[35rem] max-w-[100rem] px-20 mx-auto '>

                {/* main header*/}

                <div className='w-[70vw] md:w-[45vw] '>

                    <div className='font-roboto text-black/80 '>

                        <h2 className='hidden md:block pb-4 pt-8  sm:text-2xl  md:text-3xl lg:text-4xl xl:text-6xl'>Discover New Level </h2>
                        <h2 className='hidden md:block pb-2 md:text-3xl lg:text-4xl xl:text-6xl '>Of Street Style</h2>

                        {/* mobile text*/}
                        <h2 className='flex justify-center md:hidden pb-2 pt-8 text-3xl'>Find Your dream</h2>
                        <h2 className='items-center flex justify-center md:hidden pb-2 text-3xl'>Models Of <span className='pl-3 text-4xl font-extrabold text-[#0078aa]' >Sneakers!</span></h2>


                        <div className='flex items-center'>
                            <h2 className='hidden md:flex md:text-3xl lg:text-4xl xl:text-6xl md:pr-4 '> With Our </h2>
                            <h2 className='hidden md:flex text-[#0078aa] font-bold md:text-4xl lg:text-5xl xl:text-7xl md:pb-2 xl:pb-0'> Sneakers!</h2>
                        </div>
                    </div>


                    <div className=' text-black/60 lg:text-lg xl:text-xl font-roboto-bold pt-5 w-60 md:w-[18rem] lg::w-[24rem] xl:w-[35rem]'>
                        <span className='hidden md:inline'> Get to know our latest technology that will allow you to create your dream shoes.</span>
                        <span className='hidden xl:inline'> In our store, we will take you into the unknown world of Sneakers.</span>

                    </div>

                    {/* div for buttons */}

                    <div className='flex justify-center md:justify-start  font-roboto-bold text-black/80 md:mt-8 '>

                        {/* First button */}

                        <div className='mr-4 md:mr-8 flex items-center bg-[#97DEFF] rounded-3xl px-3  md:px-5  lg:px-2 xl:px-4 shadow-lg hover:bg-[#59c9fd] hover:shadow-inner cursor-pointer'>
                            <button type="button" className='md:text-xs lg:text-sm xl:text-lg flex md:block lg:flex '>
                                <h1 className='pr-2 md:pr-0 lg:pr-2'>Design</h1>
                                <h1 className=''> Shoes</h1>
                            </button>
                        </div>

                        {/* Second button*/}

                        <div className='flex items-center rounded-3xl px-4 md:px-5 lg:px-2 xl:px-4 py-2 md:py-3 shadow-lg border-2 border-black/50 hover:bg-[#97DEFF] hover:border-[#97DEFF] hover:shadow-inner cursor-pointer'>
                            <button type="button" className='md:text-xs lg:text-sm xl:text-lg flex md:block lg:flex'>
                                <h1 className='pr-2 md:pr-0 lg:pr-2'>View</h1>
                                <h1 className=''> Products</h1>
                            </button>
                            <BsArrowRightShort size={25} className='block md:hidden lg:block' />
                        </div>
                    </div>

                    {/* List of 3 descriptions (delivery, design, lowest price)*/}

                    <div className=' flex justify-center md:justify-start  mt-12 lg:mt-20 text-black/80 font-roboto-bold'>

                        <ShopInfo icon={<HiOutlinePaintBrush size={25} color={"#0078aa"} className='pr-1' />} border={"border-r"} text1={"Custom"} text2={"Design"} />

                        <ShopInfo icon={<HiOutlinePaintBrush size={25} color={"#0078aa"} className='pr-1' />} border={"border-r"} text1={"Fast"} text2={"Delivery"} />

                        <ShopInfo icon={<HiOutlinePaintBrush size={25} color={"#0078aa"} className='pr-1' />} border={"border-none"} text1={"Lowest"} text2={"Price"} />

                    </div>

                </div>

                {/* Blazer image*/}

                <div className='hidden md:flex opacity-80 up-down-aniamation  '>

                    <img src={blazer} alt="Photo of Blazer Mid" className='md:h-[22rem] lg:h-[28rem] xl:h-[35rem]' />

                </div>

                {/* Mobile shoes image*/}

                <div className='flex md:hidden justify-center mt-14 opacity-90 scale-animation'>
                    <img src={blazers} alt="Photo of Blazers Mid" className='h-28 ' />
                </div>

                {/* wave*/}

            </div >
            <svg className='zdjecie' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 180">
                <path fill="#ffffff" fill-opacity="1" d="M0,96L80,90.7C160,85,320,75,480,90.7C640,107,800,149,960,149.3C1120,149,1280,107,1360,85.3L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            </svg>
        </div>

    )
}

export default MainHome;