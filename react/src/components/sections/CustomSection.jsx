import React, { useContext } from 'react';
import { ThemeContext } from '../elements/ThemeContext';
import { useTranslation } from "react-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import custom from '../../assets/images/custom.jpg';
import custom1 from '../../assets/images/custom1.jpg';

function CustomSection() {

    const { theme, setTheme } = useContext(ThemeContext);
    const { t } = useTranslation()

    return (

        <div className='customSection-background'>


            {/* wave*/}

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 180">
                <path fill={theme === 'dark' ? "#101010" : "#fff"} fillOpacity="1" d="M0,160L80,138.7C160,117,320,75,480,80C640,85,800,139,960,160C1120,181,1280,171,1360,165.3L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
            </svg>


            {/* main text*/}

            <div className='flex justify-center mt-20'>
                <h2 className=' text-white font-roboto-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl'>{t('customSection.main')}</h2>

            </div>


            {/* div for grids*/}

            <div className='flex justify-center lg:space-x-8 pb-28 lg:pb-44  '>

                <div className='hidden lg:block mt-20 shadow-white up-down-aniamation '>

                    <LazyLoadImage
                        src={custom}
                        alt="Custom shoes"
                        effect="blur"
                        placeholderSrc={custom}
                        className='rounded-3xl lg:h-[31rem] xl:h-[37rem] ' />

                </div>

                <div >
                    <div className='mt-10 lg:mt-20 flex justify-center up-down-aniamation2'>
                        <LazyLoadImage
                            src={custom1}
                            alt="Custom shoes"
                            effect="blur"
                            placeholderSrc={custom1}
                            className='rounded-3xl h-[11rem] md:h-[13rem]' />
                    </div>

                    <div >

                        <div className=' text-white font-roboto-bold text-base md:text-xl xl:text-2xl w-[24rem] md:w-[28rem] xl:w-[27rem] mt-8 text-center lg:text-left'>
                            <p className='mb-4 xl:mb-9 text-2xl md:text-3xl shadow-text lg:text-left  '>{t('customSection.text1')}</p>
                            {t('customSection.text2')}
                        </div>
                    </div>

                    <div className='flex justify-center lg:justify-start'>
                        <button type="button" className='text-xl xl:text-2xl rounded-3xl bg-white text-center mt-8 xl:mt-12 w-auto py-3 px-4 transform hover:scale-110 transition ease-out duration-300'>
                            <p className='text-black' >{t('customSection.button')}</p>
                        </button>
                    </div>

                </div>
            </div >

        </div >
    );
}

export default CustomSection;