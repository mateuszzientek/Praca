import React from 'react';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import zdjecie from "../../assets/images/404.png"
import { BsArrowRightShort } from "react-icons/bs";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';


function PageNotFound(props) {

    const navigate = useNavigate();
    const { t } = useTranslation()
    return (
        <div className='bg-[#ECF8F9] dark:bg-[#4f4f4f]  h-[100vh] w-[100vw] flex flex-col  justify-start items-center '>

            <LazyLoadImage
                alt="404 Page not found"
                className='w-[30rem] h-[20rem] lg:w-[40rem] lg:h-[30rem] '
                src={zdjecie}
                effect="blur"
                placeholderSrc={zdjecie} />

            <div className='text-center font-lato text-black/80 dark:text-white/80 '>
                <p className='mt-16 font-bold text-4xl md:text-5xl lg:text-7xl '>{t("pagenotfound.main")}</p>
                <p className='mt-8 text-xl lg:text-2xl w-[80%] mx-auto md:w-[auto]'>{t("pagenotfound.text")}</p>
            </div >

            <button onClick={() => navigate("/")} type="button" className='flex items-center text-xl lg:text-2xl rounded-full bg-[#97DEFF] shadow-button w-auto px-4 h-[3rem] mt-10 transform hover:scale-110 transition ease-out duration-300 '>
                <p className='text-black/80' >{t("pagenotfound.button")}</p>
                <BsArrowRightShort size={25} />
            </button>

        </div >
    );
}

export default PageNotFound;