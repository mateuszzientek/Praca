import React, { useContext } from 'react';
import Navbar from '../sections/Navbar';
import { useTranslation } from "react-i18next";
import { ThemeContext } from '../elements/ThemeContext';
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import contact from "../../assets/images/contact.png";
import contact_black from "../../assets/images/contact-black.png";
import { AiOutlineArrowDown } from "react-icons/ai";


function Contact(props) {

    const { theme, setTheme } = useContext(ThemeContext);
    const { t } = useTranslation()



    return (
        <>
            <div className="relative">
                <Navbar background="bg-white" extra="absolute top-0 left-0 right-0 z-10" shadow="shadow-button" />

                <LazyLoadImage
                    src={theme === "dark" ? contact_black : contact}
                    alt="Photo showing office"
                    className="h-[650px] w-screen flex items-center justify-center"
                    effect="blur"
                    placeholderSrc={theme === "dark" ? contact_black : contact}
                />

                <div className=" text-center absolute top-[57%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <p className=" text-8xl font-lato text-black/80 dark:text-white">
                        {t('contact.main')}
                    </p>
                    <div className="text-3xl font-lato text-black/80 dark:text-white mt-6 ">
                        <p className='w-[40rem] mb-2 mx-auto'> {t('contact.text1')}</p>
                        <p className='w-auto'>  {t('contact.text2')}</p>
                    </div>


                </div>
                <div className='flex justify-center absolute bottom-[9%] w-screen h-12 transform left-0'>


                    <div className='flex justify-center items-center w-12 h-12  bg-black/80 dark:bg-white rounded-full animate-bounce'>
                        <AiOutlineArrowDown size={30} color={theme === "dark" ? "black" : "white"} />

                    </div>


                </div>


            </div >
        </>
    );
}

export default Contact;