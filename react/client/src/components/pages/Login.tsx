import React, { useState, useContext, useEffect } from 'react';
import { LoginContext } from '../elements/LoginProvider';
import { ThemeContext } from '../elements/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BsArrowLeft } from 'react-icons/bs';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import zdjecie from '../../assets/images/pp.jpg';
import chrome from '../../assets/images/chrome.png';
import axios from 'axios';
import validator from 'validator';

interface Errors {
    email: string;
}

function Login() {
    const { theme, setTheme } = useContext(ThemeContext);
    const { isLoginSelected, setLoginSelected } = useContext(LoginContext);
    const [showPassword, setShowPassword] = useState(false);
    const [emailOffert, setEmailOffert] = useState(false);
    const [isUserSaved, setIsUserSaved] = useState(false);
    const [errors, setErrors] = useState<Errors>({ email: '' });

    const [email, setEmail] = useState('');
    const [nick, setNick] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailOffertChange = () => {
        setEmailOffert(!emailOffert); // Odwróć wartość stanu przy każdej zmianie
    };

    const handleNickChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNick(event.target.value);

    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);

    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);

    };

    const validateData = () => {
        const newErrors = {
            email: '',
        };

        // Sprawdź warunek dla adresu e-mail (co najmniej jedna duża litera)
        if (email && !validator.isEmail(email)) {
            newErrors.email = 'Podany email jest niepoprawny';
        }

        setErrors(newErrors);

        // Zwróć true, jeśli nie ma żadnych błędów walidacji, w przeciwnym razie false
        return Object.keys(newErrors.email).length === 0;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Waliduj dane przed wysłaniem formularza
        const isValid = validateData();

        if (isValid) {
            const userData = {
                nick: nick,
                password: password,
                email: email,
                role: 'user',
                email_offert: emailOffert,
            };

            axios
                .post('/login', userData)
                .then((response) => {
                    setIsUserSaved(true);
                    setTimeout(() => {
                        navigate(-1);
                    }, 1500);
                })
                .catch((error) => {
                    console.error(error.response.data);
                    // Dodaj logikę obsługi błędu logowania
                });
        }
    };

    const handleEmailBlur = () => {
        validateData();
    };

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
            {isUserSaved && (
                <div className="bg-black/80 fixed w-full h-screen z-10 flex justify-center items-center ">
                    <div className="relative bg-white dark:bg-black dark:border-white dark:border-2 w-[25rem] h-[27rem] md:w-[35rem] md:h-[28rem] lg:w-[45rem] lg:h-[35rem] rounded-2xl"></div>
                </div>
            )}

            <BsArrowLeft onClick={() => navigate(-1)} className="absolute top-2 lg:top-10 left-10 cursor-pointer hover:scale-110 transition ease-in-out duration-300 " size={50} color={theme === 'dark' ? 'white' : 'black'} />

            <div className="bg-[#ececec] dark:bg-black/80 w-screen min-h-screen flex items-center justify-center ">
                <div className="flex flex-col lg:flex-row my-20 w-[90%] lg:w-[60%] h-screen/2 shadow-button rounded-3xl animate-fade-in-long">
                    <div className="relative flex justify-center w-full h-[15rem] lg:h-auto lg:w-[50%] ">
                        <img alt="Photo of ocean" className="object-cover w-full h-full rounded-t-3xl lg:rounded-r-none lg:rounded-l-3xl " src={zdjecie} />
                    </div>

                    <div className="flex flex-col items-center bg-white dark:bg-black/60 w-full lg:w-[50%] rounded-b-3xl lg:rounded-l-none lg:rounded-r-3xl">
                        <p className="text-black dark:text-white text-3xl xl:text-4xl pt-10">
                            {isLoginSelected ? t('login.textlogin') : t('login.textregister')}
                        </p>

                        <div className="flex mt-10 text-2xl font-lato mb-10">
                            <button
                                className={`px-8 py-4 border-b-2  hover:text-[#72cff7] ${isLoginSelected ? " border-[#72cff7]  text-[#72cff7]" : "border-black/30 dark:border-white text-black/70 dark:text-white"}`}
                                onClick={handleLoginClick}
                            >
                                {t('login.signin')}
                            </button>
                            <button
                                className={`px-8 py-4 border-b-2  hover:text-[#72cff7] ${isLoginSelected ? "border-black/30 dark:border-white text-black/70 dark:text-white" : "border-[#72cff7]  text-[#72cff7]"}`}

                                onClick={handleRegisterClick}
                            >
                                {t('login.signup')}
                            </button>
                        </div>

                        <form className="w-[70%]" onSubmit={handleSubmit}>
                            {!isLoginSelected && (
                                <input
                                    value={nick}
                                    onChange={handleNickChange}
                                    className="mb-6 w-[100%] h-[3rem] bg-[#e9e9e9] px-4 rounded-3xl focus:outline-none focus:border-2 border-black/60"
                                    placeholder={t('login.nick') as string}
                                />
                            )}

                            <input
                                type="email"
                                value={email}
                                onBlur={handleEmailBlur}
                                onChange={handleEmailChange}
                                className={`w-[100%] h-[3rem] bg-[#e9e9e9] px-4 rounded-3xl focus:outline-none focus:border-2 border-black/60 ${errors.email && "border-2 border-red-400"}`}
                                placeholder={t('login.email') as string}
                            />

                            {errors.email && <p className="text-red-500 text-sm mt-2 ml-2">{errors.email}</p>}

                            <div className="relative flex items-center w-[100%] h-[3rem] bg-[#e9e9e9] rounded-3xl mt-6">
                                <input
                                    value={password}
                                    onChange={handlePasswordChange}
                                    type={showPassword ? 'text' : 'password'}
                                    className="bg-transparent w-full h-full rounded-3xl px-4 focus:outline-none focus:border-2 border-black/60"
                                    placeholder={t('login.password') as string}
                                />
                                <div onClick={togglePasswordVisibility} className="absolute right-4">
                                    {showPassword ? (
                                        <AiOutlineEye size={20} className="cursor-pointer hover:scale-105 transition ease-in-out duration-300" />
                                    ) : (
                                        <AiOutlineEyeInvisible size={20} className="cursor-pointer hover:scale-105 transition ease-in-out duration-300" />
                                    )}
                                </div>
                            </div>

                            {isLoginSelected && (
                                <button
                                    type="submit"
                                    className="mt-6 w-[100%] h-[3rem] bg-black/80 dark:bg-[#72cff7] px-4 rounded-3xl hover:scale-105 transition ease-in-out duration-300"
                                >
                                    <p className="text-white dark:text-black font-lato text-xl">{t('login.signin')}</p>
                                </button>
                            )}
                            {!isLoginSelected && (
                                <div className="flex justify-center items-center space-x-4 mt-6">
                                    <input onChange={handleEmailOffertChange} type="checkbox" className="w-5 h-5 checked:bg-blue-500 cursor-pointer " />
                                    <p className="font-lato w-[100%] text-sm text-black dark:text-white">{t('login.text')}</p>
                                </div>
                            )}

                            {!isLoginSelected && (
                                <button
                                    type="submit"
                                    className="mt-6 w-[100%] h-[3rem] bg-black/80 dark:bg-[#72cff7] px-4 rounded-3xl hover:scale-105 transition ease-in-out duration-300"
                                >
                                    <p className="text-white dark:text-black font-lato text-xl">{t('login.create')}</p>
                                </button>
                            )}
                        </form>

                        {!isLoginSelected && (
                            <p className="font-lato w-[70%] text-sm mt-6 text-black dark:text-white ">
                                {t('login.text4')} <span className="font-bold">{t('login.text5')}</span> {t('login.text6')} <span className="font-bold">{t('login.text7')}</span> .
                            </p>
                        )}

                        {isLoginSelected && (
                            <button className="text-black dark:text-white font-lato text-xl mt-6">{t('login.forgot')}</button>
                        )}

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
