import React from "react";
import { useTranslation } from "react-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import img from '../assets/images/custom.jpg';
import img1 from '../assets/images/custom1.jpg';

function OwnPhotoSecion() {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col xl:flex-row justify-center items-center bg-white dark:bg-black/90  pt-28 pb-28  space-x-3">

            {/* main text */}

            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:mx-0 xl:w-[28rem] space-y-3 font-roboto ">
                <div className="mb-6 text-center xl:text-left">
                    <div className="flex space-x-2 xl:space-x-0 xl:block justify-center">
                        <p className="text-black dark:text-white"> {t('ownphotosection.text1')}<span className="font-bold text-[hsl(199,100%,57%)]"> 10% </span>{t('ownphotosection.text2')}</p>
                        <p className="text-black dark:text-white xl:mt-2 lowercase xl:normal-case"> {t('ownphotosection.text3')}</p>
                    </div>
                    <p className="text-black dark:text-white pt-6 text-base sm:text-lg md:text-2xl mx-auto w-[25rem] sm:w-[30rem]  md:w-[35rem] lg:w-[45rem] xl:w-auto xl:pr-12 "> {t('ownphotosection.text4')}</p>
                </div>

                {/* below text image */}

                <LazyLoadImage
                    src={img1}
                    alt="zdjecie"
                    effect="blur"
                    placeholderSrc={img1}
                    className="hidden xl:block h-[13rem] w-[100%] rounded-2xl" />

            </div>

            {/* right grid (left column) images */}

            <div className="flex space-x-3 justify-center w-[25rem] h-[20rem] sm:w-[30rem] sm:h-[25rem] md:w-[40rem] md:h-[32rem] lg:w-auto">
                <div className=" space-y-3">
                    <div>
                        <LazyLoadImage
                            src={img}
                            alt="zdjecie"
                            effect="blur"
                            placeholderSrc={img}
                            className="h-[16rem] w-[15rem] rounded-2xl  " />
                    </div>
                    <div>
                        <LazyLoadImage
                            src={img}
                            effect="blur"
                            alt="zdjecie"
                            className="h-[16rem] w-[15rem] rounded-2xl " />
                    </div>
                </div>

                {/* right grid (right column) images */}

                <div className="space-y-3 ">

                    <LazyLoadImage
                        src={img1}
                        alt="zdjecie"
                        effect="blur"
                        placeholderSrc={img1}
                        className="h-[40%] w-[31rem] rounded-2xl " />

                    <div className="flex space-x-3 h-[11.6rem] sm:h-[14.5rem] md:h-[18.5rem]">
                        <div>

                            <LazyLoadImage
                                src={img}
                                alt="zdjecie"
                                effect="blur"
                                placeholderSrc={img}
                                className="h-[19rem] w-[15.2rem] rounded-2xl  " />

                        </div>
                        <div className="space-y-3">

                            <div>
                                <LazyLoadImage
                                    src={img}
                                    alt="zdjecie"
                                    effect="blur"
                                    placeholderSrc={img}
                                    className="h-[9rem] w-[15rem] rounded-2xl " />
                            </div>
                            <div>
                                <LazyLoadImage
                                    src={img}
                                    alt="zdjecie"
                                    effect="blur"
                                    placeholderSrc={img}
                                    className="h-[9rem] w-[15rem] rounded-2xl  " />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
}

export default OwnPhotoSecion;