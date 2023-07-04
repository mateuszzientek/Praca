import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';
import { useTranslation } from "react-i18next";
import { AiOutlineClose } from 'react-icons/ai';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { UserContext } from '../elements/UserProvider';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { BsSend } from 'react-icons/bs';
import photo from '../../assets/images/newslatter.png';
import photo_black from '../../assets/images/newslatter-black.png';
import axios from 'axios';
import validator from 'validator';


interface Error {
    msg: string;
    type: string;
    value: string;
    path: string;
    location: string;
}

function Newslatter() {

    const { theme, setTheme } = useContext(ThemeContext);
    const [showNewslatter, setShowNewslatter] = useState(false);
    const { t } = useTranslation()
    const { user, setUser, isUserLoggedIn, setIsUserLoggedIn } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [errorsVadlidationServer, setErrorsVadlidationServer] = useState<Error[]>([]);
    const [errorsServer, setErrorsServer] = useState("");


    {/* show up newslatter */ }

    const validateData = () => {
        setMessage("");

        if (email && !validator.isEmail(email)) {
            const message = t('loginError.email')
            setMessage(message);
            return false;
        }
        return true;
    };

    useEffect(() => {
        if (user?.newsletter === false || !user) {
            const timer = setTimeout(() => {
                const storedExpiryTime = localStorage.getItem('newslatter');

                setEmail("")

                const saveLocalNewstatter = () => {
                    setShowNewslatter(true);
                    const currentTime = new Date().getTime();
                    const expiryTime = currentTime + 10 * 60 * 1000; // 10 minut
                    localStorage.setItem('newslatter', expiryTime.toString());
                }

                if (storedExpiryTime) {
                    const currentTime = new Date().getTime();
                    const expiryTime = parseInt(storedExpiryTime);

                    if (currentTime >= expiryTime) {
                        saveLocalNewstatter()
                    }
                } else {
                    saveLocalNewstatter()
                }
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [user?.newsletter]);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        if (!email) {
            const message = t('loginError.error8');
            setMessage(message);
            return;
        }

        if (!validateData()) {
            return;
        }

        axios
            .post("/newsletter", { email })
            .then((response) => {
                setShowNewslatter(false);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.error) {
                    setErrorsServer(error.response.data.error)

                } else if (error.response && error.response.data && error.response.data.errors) {
                    setErrorsVadlidationServer(error.response.data.errors)

                } else {
                    console.log(error);
                }
            });
    };


    return (
        <div>
            {showNewslatter && (
                <div className='bg-black/80 fixed w-full h-screen z-10 flex justify-center items-center '>

                    <div className='relative  bg-white dark:bg-black dark:border-white dark:border-2 w-[25rem] h-[27rem] md:w-[35rem] md:h-[28rem] lg:w-[45rem] py-10 lg:h-auto rounded-2xl'>
                        <div onClick={() => {
                            setShowNewslatter(!showNewslatter)
                        }}>
                            <AiOutlineClose size={30} color={theme === 'dark' ? "white" : "black"} className='absolute right-4 top-6 cursor-pointer hover:scale-125' />
                        </div>

                        <div className='flex flex-col items-center justify-center font-roboto text-black dark:text-white'>

                            {/* iamge */}
                            <LazyLoadImage
                                src={theme === 'dark' ? photo_black : photo}
                                alt="Newslatter"
                                effect="blur"
                                placeholderSrc={theme === 'dark' ? photo_black : photo}
                                className='w-[5rem] h-[5rem] lg:w-[10rem] lg:h-[10rem] ' />

                            {/* main text */}
                            <p className='text-4xl md:text-5xl lg:text-6xl mt-8 font-bold text-[#0078aa]'>{t('newslatter.main')}</p>

                            {/* second text */}
                            <p className='text-lg lg:text-2xl mt-6 text-center px-10'>{t('newslatter.text')} </p>

                            {/* input for email */}
                            <form onSubmit={handleSubmit} className='flex flex-col '>

                                <div className='flex relative items-center'>
                                    <input value={email} onChange={handleEmailChange} className='bg-[hsl(198,100%,91%)] w-[20rem] md:w-[30rem] h-[4rem] lg:w-[35rem] lg:h-[5rem] mt-6 rounded-full px-3 shadow-2xl focus:outline-none text-xl text-black focus:border-2 border-black/60 focus:bg-[hsl(198,100%,84%)] hover:bg-[hsl(198,100%,84%)]' type='email' placeholder={t('newslatter.input') as string}>
                                    </input>
                                    {/* button in input */}
                                    <button type="submit" className='flex justify-center items-center bg-[#0078aa] h-[4rem] w-[4rem] lg:h-[5rem] lg:w-[5rem] rounded-full mt-6 absolute right-0 hover:scale-105 transition hover:ease-in-out duration-300'>
                                        <BsSend size={40} color='white' />
                                    </button>
                                </div>

                                {message && <p className='text-red-500 text-base mt-6  ml-4'>{message}</p>}

                                {errorsServer && <p className="text-red-500 text-sm mt-2 ml-2">{errorsServer}</p>}

                                {errorsVadlidationServer.map((error: Error, index: number) => (
                                    <p key={index} className="text-red-500 text-sm mt-2 ml-2">{error.msg}</p>
                                ))}
                            </form>

                        </div>


                    </div>

                </div >
            )
            }
        </div >

    );
}

export default Newslatter;