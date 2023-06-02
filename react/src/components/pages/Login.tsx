import React, { useState, useContext } from 'react';
import { LoginContext } from '../elements/LoginProvider';
import { ThemeContext } from '../elements/ThemeContext';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BsArrowLeft } from "react-icons/bs";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import zdjecie from '../../assets/images/pp.jpg';
import chrome from '../../assets/images/chrome.png';

function Login() {

    const { theme, setTheme } = useContext(ThemeContext);
    const { isLoginSelected, setLoginSelected } = useContext(LoginContext);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLoginClick = () => {
        setLoginSelected(true);
    };

    const handleRegisterClick = () => {
        setLoginSelected(false);
    };

    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <>
            <BsArrowLeft onClick={() => navigate(-1)} className='absolute top-2 lg:top-10 left-10 cursor-pointer hover:scale-110 transition ease-in-out duration-300 ' size={50} color={theme === "dark" ? "white" : "black"} />

            <div className='bg-[#ececec] dark:bg-black/80 w-screen min-h-screen flex items-center justify-center '>

                <div className='flex flex-col lg:flex-row my-20 w-[90%] lg:w-[60%] h-screen/2 shadow-button rounded-3xl animate-fade-in-long'>

                    <div className='relative flex justify-center w-full h-[15rem] lg:h-auto lg:w-[50%] '>
                        <img
                            alt="Photo of ocean"
                            className='object-cover w-full h-full rounded-t-3xl lg:rounded-r-none lg:rounded-l-3xl '
                            src={zdjecie}
                        />



                    </div>

                    <div className='flex flex-col items-center bg-white dark:bg-black/60 w-full lg:w-[50%] rounded-b-3xl lg:rounded-l-none lg:rounded-r-3xl'>

                        <p className='text-black dark:text-white text-3xl xl:text-4xl pt-10'>{isLoginSelected ? t('login.textlogin') : t('login.textregister')}</p>

                        <div className='flex mt-10 text-2xl font-lato mb-10'>
                            <button
                                className={`px-8 py-4 border-b-2  hover:text-[#72cff7] ${isLoginSelected ? 'border-[#72cff7]  text-[#72cff7] ' : 'border-black/30 dark:border-white text-black/70 dark:text-white'}`}
                                onClick={handleLoginClick}
                            >
                                {t('login.signin')}
                            </button>
                            <button
                                className={`px-8 py-4 border-b-2  hover:text-[#72cff7] ${!isLoginSelected ? 'border-[#72cff7]  text-[#72cff7]' : 'border-black/30 dark:border-white text-black/70 dark:text-white'}`}
                                onClick={handleRegisterClick}
                            >
                                {t('login.signup')}
                            </button>
                        </div>

                        {!isLoginSelected &&
                            <input className='mb-6 w-[70%] h-[3rem] bg-[#e9e9e9] px-4 rounded-3xl focus:outline-none focus:border-2 border-black/60' placeholder={t('login.name') as string}></input>

                        }

                        <input type="email" className=' w-[70%] h-[3rem] bg-[#e9e9e9] px-4 rounded-3xl focus:outline-none focus:border-2 border-black/60' placeholder={t('login.email') as string}></input>

                        <div className='relative flex items-center w-[70%] h-[3rem] bg-[#e9e9e9] rounded-3xl mt-6'>
                            <input type={showPassword ? "text" : "password"} className='bg-transparent w-full h-full rounded-3xl px-4 focus:outline-none focus:border-2 border-black/60' placeholder={t('login.password') as string} />
                            <div onClick={togglePasswordVisibility} className="absolute right-4">
                                {showPassword ? <AiOutlineEye size={20} className='cursor-pointer hover:scale-105 transition ease-in-out duration-300' /> : <AiOutlineEyeInvisible size={20} className='cursor-pointer hover:scale-105 transition ease-in-out duration-300' />}
                            </div>
                        </div>

                        {isLoginSelected &&
                            <button className='mt-6 w-[70%] h-[3rem] bg-black/80 dark:bg-[#72cff7] px-4 rounded-3xl hover:scale-105 transition ease-in-out duration-300'>
                                <p className='text-white dark:text-black font-lato text-xl'>{t('login.signin')}</p>
                            </button>
                        }

                        {!isLoginSelected &&
                            <div className='flex justify-center items-center space-x-4 mt-6'>
                                <input type="checkbox" className="w-5 h-5 checked:bg-blue-500 cursor-pointer " />
                                <p className='font-lato w-[60%] text-sm text-black dark:text-white'>{t('login.text')}</p>
                            </div>

                        }

                        {!isLoginSelected &&
                            <button className='mt-6 w-[70%] h-[3rem] bg-black/80 dark:bg-[#72cff7] px-4 rounded-3xl hover:scale-105 transition ease-in-out duration-300'>
                                <p className='text-white dark:text-black font-lato text-xl'>{t('login.create')}</p>
                            </button>
                        }

                        {!isLoginSelected &&
                            <p className='font-lato w-[70%] text-sm mt-6 text-black dark:text-white '> {t('login.text4')} <span className='font-bold'>{t('login.text5')}</span> {t('login.text6')} <span className='font-bold'>{t('login.text7')}</span> .</p>
                        }


                        {isLoginSelected &&
                            <button className='text-black dark:text-white font-lato text-xl mt-6 hover:scale-105 transition ease-in-out duration-300'>{t('login.forgot')}</button>
                        }



                        <div className='flex w-[70%] items-center justify-center mt-8 '>
                            <div className="border-b border-black/50 dark:border-white w-[20%]  "></div>
                            <p className='text-black dark:text-white font-lato text-sm mx-3    '>{isLoginSelected ? t('login.text2') : t('login.text3')}</p>
                            <div className="border-b border-black/50 dark:border-white w-[20%]  "></div>
                        </div>

                        <button className='flex items-center justify-center space-x-2 mt-10 mb-10 w-[70%] h-[3rem] bg-white border-black border-2  px-4 rounded-3xl hover:scale-105 transition ease-in-out duration-300'>
                            <img src={chrome} className='rounded-full w-[2rem] h-[2rem]' />
                            <p className='text-black font-lato text-xl'>Google</p>
                        </button>

                    </div>
                </div>
            </div >
        </>
    );
}

export default Login;
