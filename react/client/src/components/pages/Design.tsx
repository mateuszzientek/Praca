import React from 'react';
import Navbar from "../sections/Navbar";
import { IoColorFillOutline, IoTextOutline } from "react-icons/io5";
import { TbShoe } from "react-icons/tb";
import { AiOutlinePicture } from "react-icons/ai";
import { FiSave } from "react-icons/fi";
import nikeShoe from "../../assets/images/nikeShoe.png"
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function Design() {
    const { t } = useTranslation();
    const navigate = useNavigate();


    return (
        <div className=' min-h-screen bg-[#F5EFE7] dark:bg-[#5c5c5c] pb-20'>
            <Navbar background="bg-white" shadow="shadow-lg" />
            <div>

            </div>
            <div className='flex flex-col items-center mt-20 text-center'>
                <p className='text-4xl text-black/80 font-bold dark:text-white/80 w-[90%]'>{t("design.text1")}</p>
                <p className='text-xl text-black/60 dark:text-white/60 mt-4 '>{t("design.text2")} </p>
            </div>

            <div className=' w-screen md:w-[43rem] lg:w-[55rem] 2xl:w-[65rem] text-black/80 dark:text-white/80 mt-16 mx-auto flex flex-col md:flex-row md:justify-between items-center '>

                <div className='flex flex-row md:flex-col md:items-center md:space-y-16 space-x-10 md:space-x-0'>

                    <div className='flex flex-col items-center w-[10rem] text-center space-y-2'>
                        <IoColorFillOutline size={30} />
                        <p >{t("design.text4")}</p>
                    </div>
                    <div className='flex flex-col items-center w-[10rem] text-center space-y-2'>
                        <FiSave size={30} />
                        <p >{t("design.text7")}</p>
                    </div>
                </div>

                <img
                    src={nikeShoe}
                    alt="Photo of shoe"
                    className='h-[12rem] md:h-[10rem] lg:h-[15rem] 2xl:h-[18rem] my-10 lg:my-0 -rotate-1 md:-rotate-45 lg:-rotate-20 md:mr-10 '
                />

                <div className='flex flex-row md:flex-col md:items-center md:space-y-16 space-x-10 md:space-x-0 '>
                    <div className='flex flex-col items-center w-[10rem] text-center space-y-2'>
                        < AiOutlinePicture size={30} />
                        <p >{t("design.text5")}</p>
                    </div>
                    <div className='flex flex-col items-center w-[10rem] text-center space-y-2'>
                        <IoTextOutline size={30} />
                        <p >{t("design.text6")}</p>
                    </div>
                </div>

            </div>
            <div className='flex justify-center items-center text-black/80 dark:text-white/80 mt-6 lg:mt-10 space-y-10'>

                <button onClick={() => navigate("/customization")} className='px-4 py-3 bg-black/80 dark:bg-black/60 text-white rounded-full hover:scale-105 ease-in-out duration-500'>
                    <p className='text-xl'>{t("design.text8")}</p>

                </button>
            </div>
        </div>
    );
}

export default Design;