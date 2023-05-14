import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { LazyLoadImage } from "react-lazy-load-image-component";
import custom from '../assets/images/custom.jpg';
import custom1 from '../assets/images/custom1.jpg';

function CustomSection() {

    const { theme, setTheme } = useContext(ThemeContext);

    return (

        <div className='customSection-background'>


            {/* wave*/}

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 180">
                <path fill={theme === 'dark' ? "#101010" : "#fff"} fill-opacity="1" d="M0,160L80,138.7C160,117,320,75,480,80C640,85,800,139,960,160C1120,181,1280,171,1360,165.3L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
            </svg>


            {/* main text*/}

            <div className='flex justify-center mt-20'>
                <h2 className=' text-white font-roboto-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl'>ADD SOMETHING OF YOUR OWN!</h2>

            </div>


            {/* div for grids*/}

            <div className='flex justify-center lg:space-x-8 pb-28 lg:pb-44  '>

                <div className='hidden lg:block mt-20 shadow-white up-down-aniamation '>
                    <LazyLoadImage
                        src={custom}
                        alt="Zdjecie customowanych butow"
                        effect="opacity"
                        placeholderSrc={custom}
                        className='rounded-3xl lg:h-[31rem] xl:h-[37rem] ' />
                </div>

                <div >
                    <div className='mt-10 lg:mt-20 flex justify-center up-down-aniamation2'>
                        <LazyLoadImage
                            src={custom1}
                            alt="Zdjecie customowanych butow"
                            effect="opacity"
                            placeholderSrc={custom1}
                            className='rounded-3xl h-[11rem] md:h-[13rem]' />
                    </div>

                    <div >
                        <h2 className=' text-white font-roboto-bold text-base md:text-xl xl:text-2xl w-[24rem] md:w-[28rem] xl:w-[27rem] mt-8 text-center lg:text-left'>
                            <h2 className='mb-4 xl:mb-9 text-2xl md:text-3xl shadow-text lg:text-left  '>Dream shoes possible now!</h2>
                            With our creator, you can easily design personalized shoes for yourself.
                            You will have the option to change the color, add your
                            favorite inscriptions or inserts. Only your imagination limits you,
                            so let's get creative!</h2>
                    </div>

                    <div className='flex justify-center lg:justify-start'>
                        <button type="button" className='text-xl xl:text-2xl rounded-3xl bg-white text-center mt-8 xl:mt-12 sm:w-36 xl:w-44 p-2 transform hover:scale-110 transition ease-out duration-300'>
                            <p className='text-black' >See more!</p>
                        </button>
                    </div>

                </div>
            </div >

        </div >
    );
}

export default CustomSection;