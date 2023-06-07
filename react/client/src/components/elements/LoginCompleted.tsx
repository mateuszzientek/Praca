import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import tick from "../../assets/images/tick.png"

interface LoginCompletedProps {
    main: string,
    text: string
}

function LoginCompleted(props: LoginCompletedProps) {
    return (
        <div className="bg-black/80 fixed w-full h-screen z-10 flex justify-center items-center ">
            <div className="flex flex-col  items-center bg-white dark:bg-black dark:border-white dark:border-2 w-[25rem] h-[27rem] lg:w-[35rem] lg:h-[28rem] xl:w-[45rem] xl:h-[30rem] rounded-2xl">
                <LazyLoadImage
                    alt="Green Tick"
                    effect="blur"
                    placeholderSrc={tick}
                    src={tick}
                    className='mt-12 w-[8rem] h-[8rem]  lg:w-[10rem] lg:h-[10rem] xl:w-[12rem] xl:h-[12rem]' />
                <p className='text-black dark:text-white mt-12 text-2xl lg:text-3xl xl:text-4xl'>{props.main}</p>
                <p className='mt-6 text-center text-xl lg:text-2xl xl:text-3xl text-black/60 dark:text-white/70'>{props.text}</p>
            </div>
        </div>
    );
}

export default LoginCompleted;