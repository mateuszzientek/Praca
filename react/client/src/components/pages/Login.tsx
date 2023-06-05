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
import tick from "../../assets/images/tick.png"


function Login() {
    const { theme, setTheme } = useContext(ThemeContext);
    const { isLoginSelected, setLoginSelected } = useContext(LoginContext);
    const [showPassword, setShowPassword] = useState(false);
    const [emailOffert, setEmailOffert] = useState(false);
    const [isUserSaved, setIsUserSaved] = useState(false);
    const [errors, setErrors] = useState({ email: '', nick: '', pass: '' });

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
            nick: '',
            pass: ''
        };

        if (email && !validator.isEmail(email)) {
            newErrors.email = 'Invalid email';
        }
        if (nick && /[^a-zA-Z0-9\.\_]/.test(nick)) {
            newErrors.nick = 'Nick can only contain letters, numbers, dots, or underscores';
        }
        if (password && !validator.isStrongPassword(password, { minSymbols: 0 })) {
            newErrors.pass = 'Password requirements: at least 8 characters, including an uppercase letter and a number';
        }


        setErrors(newErrors);

        // Zwróć true, jeśli nie ma żadnych błędów walidacji, w przeciwnym razie false
        return Object.keys(newErrors.email || newErrors.nick || newErrors.pass).length === 0;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Waliduj dane przed wysłaniem formularza
        const isValid = validateData();

        if (!email || !password || !nick) {
            // Przynajmniej jedno z pól jest puste
            setErrors({
                email: !email ? 'Email is required' : '',
                nick: !nick ? 'Nick is required' : '',
                pass: !password ? 'Password is required' : '',
            });
            return; // Zwracamy funkcję, jeśli którekolwiek pole jest puste
        }


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

    const handleBlur = () => {
        validateData();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLoginClick = () => {
        const newErrors = {
            email: '',
            nick: '',
            pass: ''
        };

        setErrors(newErrors);

        setNick("");
        setPassword("");
        setEmail("");

        setLoginSelected(true);
    };

    const handleRegisterClick = () => {
        const newErrors = {
            email: '',
            nick: '',
            pass: ''
        };

        setErrors(newErrors);

        setNick("");
        setPassword("");
        setEmail("");

        setLoginSelected(false);
    };

    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <>
            {isUserSaved && (
                <div className="bg-black/80 fixed w-full h-screen z-10 flex justify-center items-center ">
                    <div className="flex flex-col  items-center bg-white dark:bg-black dark:border-white dark:border-2 w-[25rem] h-[27rem] lg:w-[35rem] lg:h-[28rem] xl:w-[45rem] xl:h-[30rem] rounded-2xl">
                        <LazyLoadImage
                            alt="Green Tick"
                            effect="blur"
                            placeholderSrc={tick}
                            src={tick}
                            className='mt-12 w-[8rem] h-[8rem]  lg:w-[10rem] lg:h-[10rem] xl:w-[12rem] xl:h-[12rem]' />
                        <p className='text-black dark:text-white mt-12 text-2xl lg:text-3xl xl:text-4xl'>Rejestracja zakończona sukcesem!</p>
                        <p className='mt-6 text-center text-xl lg:text-2xl xl:text-3xl text-black/60 dark:text-white/70'>Dziękujemy za dołączenie do naszej społeczności</p>
                    </div>
                </div>
            )}

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
                                    onBlur={handleBlur}
                                    onChange={handleNickChange}
                                    className={`w-[100%] h-[3rem] bg-[#e9e9e9] px-4 rounded-3xl focus:outline-none focus:border-2 border-black/60 ${errors.nick && "border-2 border-red-400"}`}
                                    placeholder={t('login.nick') as string}
                                />

                            )}

                            {!isLoginSelected && (
                                errors.nick && <p className="text-red-500 text-sm mt-2 ml-2">{errors.nick}</p>
                            )}

                            <input
                                type="email"
                                value={email}
                                onBlur={handleBlur}
                                onChange={handleEmailChange}
                                className={`mt-6 w-[100%] h-[3rem] bg-[#e9e9e9] px-4 rounded-3xl focus:outline-none focus:border-2 border-black/60 ${errors.email && "border-2 border-red-400"}`}
                                placeholder={t('login.email') as string}
                            />

                            {errors.email && <p className="text-red-500 text-sm mt-2 ml-2">{errors.email}</p>}

                            <div className="relative flex items-center w-[100%] h-[3rem] bg-[#e9e9e9] rounded-3xl mt-6">
                                <input
                                    value={password}
                                    onBlur={handleBlur}
                                    onChange={handlePasswordChange}
                                    type={showPassword ? 'text' : 'password'}
                                    className={`bg-transparent w-full h-full rounded-3xl px-4 focus:outline-none focus:border-2 border-black/60 ${errors.pass && "border-2 border-red-400"}`}
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

                            {errors.pass && <p className="text-red-500 text-sm mt-2 ml-2">{errors.pass}</p>}


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
