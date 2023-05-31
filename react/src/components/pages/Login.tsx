import React, { useState } from 'react';
import { BsArrowLeft } from "react-icons/bs";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import zdjecie from '../../assets/images/pp.jpg';
import chrome from '../../assets/images/chrome.png';

function Login() {
    const [isLoginSelected, setLoginSelected] = useState(true);

    const handleLoginClick = () => {
        setLoginSelected(true);
    };

    const handleRegisterClick = () => {
        setLoginSelected(false);
    };

    return (
        <>
            <BsArrowLeft className='fixed top-10 left-10 cursor-pointer hover:scale-110 transition ease-in-out duration-300 ' size={50} />

            <div className='bg-[#ececec] w-screen h-screen flex items-center justify-center'>

                <div className='flex  w-[60%] shadow-button rounded-3xl '>

                    <div className='relative flex justify-center w-[50%] '>
                        <img
                            alt="Photos of blazer"
                            className='object-cover w-full h-full rounded-l-3xl '
                            src={zdjecie}
                        />



                    </div>

                    <div className='flex flex-col items-center bg-white w-[50%]  rounded-r-3xl'>

                        <p className='text-black text-4xl pt-10'>{isLoginSelected ? "Miło Cię znowu widzieć!" : "Miło Cię poznać!"}</p>

                        <div className='flex mt-10 text-2xl font-lato'>
                            <button
                                className={`px-8 py-4 border-b-2  hover:text-[#72cff7] ${isLoginSelected ? 'border-[#72cff7] text-[#72cff7] ' : 'border-black/30 text-black/70'}`}
                                onClick={handleLoginClick}
                            >
                                Zaloguj się
                            </button>
                            <button
                                className={`px-8 py-4 border-b-2  hover:text-[#72cff7] ${!isLoginSelected ? 'border-[#72cff7] text-[#72cff7]' : 'border-black/30 text-black/70'}`}
                                onClick={handleRegisterClick}
                            >
                                Zarejestruj się
                            </button>
                        </div>

                        <input className='mt-10 w-[70%] h-[3rem] bg-[#e9e9e9] px-4 rounded-3xl focus:outline-none focus:border-2 border-black/60' placeholder='Adres e-mail*'></input>
                        <input className='mt-6 w-[70%] h-[3rem] bg-[#e9e9e9] px-4 rounded-3xl focus:outline-none focus:border-2 border-black/60' placeholder='Hasło*'></input>
                        <button className='mt-6 w-[70%] h-[3rem] bg-black/80 px-4 rounded-3xl hover:scale-105 transition ease-in-out duration-300'>
                            <p className='text-white font-lato text-xl'>Zaloguj się</p>
                        </button>

                        <p className='text-black font-lato text-xl mt-6'>Nie pamiętam hasła</p>

                        <div className='flex w-[70%] items-center justify-center mt-8 '>
                            <div className="border-b border-black/50 w-[25%]  "></div>
                            <p className='text-black font-lato text-sm mx-3  '>lub zaloguj się za pomocą</p>
                            <div className="border-b border-black/50 w-[25%]  "></div>
                        </div>

                        <button className='flex items-center justify-center space-x-2 mt-10 mb-10 w-[70%] h-[3rem] bg-white border-black border-2  px-4 rounded-3xl hover:scale-105 transition ease-in-out duration-300'>
                            <img src={chrome} className='rounded-full w-[2rem] h-[2rem]' />
                            <p className='text-black font-lato text-xl'>Google</p>
                        </button>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
