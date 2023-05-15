import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';
import { AiOutlineClose } from 'react-icons/ai';
import { BsSend } from 'react-icons/bs';
import photo from '../assets/images/newslatter.png';
import photo_black from '../assets/images/newslatter-black.png';

function Newslatter(props) {

    const { theme, setTheme } = useContext(ThemeContext);
    const [showNewslatter, setShowNewslatter] = useState(false);

    useEffect(() => {

        const timer = setTimeout(() => {
            setShowNewslatter(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, [])

    return (
        <div>
            {showNewslatter && (
                <div className='bg-black/80 fixed w-full h-screen z-10 flex justify-center items-center '>

                    <div className='relative  bg-white dark:bg-black dark:border-white dark:border-2 w-[45rem] h-[35rem] rounded-2xl'>
                        <div onClick={() => setShowNewslatter(!showNewslatter)}>
                            <AiOutlineClose size={30} color={theme === 'dark' ? "white" : "black"} className='absolute right-4 top-6 cursor-pointer hover:scale-125' />
                        </div>

                        <div className='flex flex-col items-center justify-center font-roboto text-black dark:text-white'>
                            <img src={theme === 'dark' ? photo_black : photo} className='w-[10rem] h-[10rem] mt-10' />
                            <p className='text-6xl mt-8 font-bold text-[#0078aa]'>GET 10% OFF!</p>
                            <p className='text-2xl mt-6 text-center px-10'>Subscribe to our newsletter and get a 15% discount on your next purchase. Sign up today and stay up to date with the latest news and updates! </p>
                            <div className='flex relative items-center '>
                                <input className='bg-[hsl(198,100%,91%)] w-[35rem] h-[5rem] mt-6 rounded-full px-3 shadow-2xl focus:outline-none text-xl text-black focus:border-2 border-black/60 focus:bg-[hsl(198,100%,84%)] hover:bg-[hsl(198,100%,84%)]' type='email' placeholder='Enter your email'>

                                </input>
                                <button className='flex justify-center items-center bg-[#0078aa] h-[5rem] w-[5rem] rounded-full mt-6 absolute right-0 hover:scale-105 transition hover:ease-in-out duration-300'>
                                    <BsSend size={40} color='white' />
                                </button>
                            </div>
                        </div>


                    </div>

                </div>
            )}
        </div>

    );
}

export default Newslatter;