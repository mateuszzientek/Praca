import React, { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import { AiOutlineHome, AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../elements/ThemeContext';
import validator from 'validator';
import axios from 'axios';
import InfoDivBottom from '../elements/InfoDivBottom';
import image from '../../assets/images/expired.png'
import image_dark from '../../assets/images/expired_dark.png'
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import CircleSvg from '../elements/CircleSvg';
import { ErrorInterface } from 'src/types';

function ResetPassword() {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const { token } = useParams();
    const { theme, setTheme } = useContext(ThemeContext);

    const [password, setPassword] = useState("")
    const [secPassword, setSecPassword] = useState("")
    const [message, setMessage] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [errorsVadlidationServer, setErrorsVadlidationServer] = useState<ErrorInterface[]>([]);
    const [errorsServer, setErrorsServer] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordSec, setShowPasswordSec] = useState(false);
    const [showInfoDiv, setShowInfoDiv] = useState(false);
    const [isSubmittingButton, setIsSubmittingButton] = useState(false);


    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSecPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSecPassword(event.target.value);
    };

    const validateData = () => {
        setMessage("");

        if (password && !validator.isStrongPassword(password, { minSymbols: 0 })) {
            const message = t('loginError.pass')
            setMessage(message);
            return false;
        }

        if (secPassword && !validator.isStrongPassword(secPassword, { minSymbols: 0 })) {
            const message = t('loginError.pass')
            setMessage(message);
            return false;
        }

        return true;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!password || !secPassword) {
            const message = t('loginError.error6')
            setMessage(message);
            return;
        }

        if (!validateData()) {
            return;
        }

        if (password !== secPassword) {
            const message = t('loginError.error7')
            setMessage(message);
            return;
        }

        setIsSubmittingButton(true)
        axios
            .post("/resetPasswordChange", { token, secPassword, password })
            .then((response) => {

                setShowInfoDiv(true)
                setTimeout(() => {
                    navigate("/login")
                }, 2000);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.error) {
                    setErrorsServer(error.response.data.error)

                } else if (error.response && error.response.data && error.response.data.errors) {
                    setErrorsVadlidationServer(error.response.data.errors)

                } else {
                    console.log(error);
                }
            })
            .finally(() => {
                setIsSubmittingButton(false);
            });


    };

    useEffect(() => {
        axios
            .post("/checkExpireToken", { token })
            .then((response) => {
                localStorage.setItem('wasOnResetPassword', 'true');
                setShowForm(true)
            })
            .catch((error) => {
                setShowForm(false)

                if (error.response && error.response.data && error.response.data.error) {
                    setErrorsServer(error.response.data.error)
                } else {
                    console.log(error);
                }
            })
    }, [])


    return (
        <div className="bg-[#ececec] relative dark:bg-black/80 w-screen min-h-screen flex items-center justify-center">

            <div className='absolute left-10 top-10 '>
                <div onClick={() => navigate("/")} className='flex items-center space-x-2 cursor-pointer hover:scale-105 transform ease-in-out duration-300'>
                    <p className='text-xl text-black/80 dark:text-white/60'>{t('passwordReset.text5')}</p>
                    <AiOutlineHome size={20} color={theme === 'dark' ? "rgb(160, 160, 160)" : "rgb(50, 50, 50)"} />
                </div>
            </div>

            {showForm ?
                (

                    <div className='w-full md:w-[30rem] h-screen md:h-auto bg-white dark:bg-white/80 shadow-button rounded flex flex-col justify-center items-center py-10'>
                        {showInfoDiv && (<InfoDivBottom color={"bg-green-500"} text={t('passwordReset.text15')} />)}

                        <p className='text-3xl mb-10'>{t('passwordReset.text6')}</p>
                        <form className='w-[80%] space-y-6' onSubmit={handleSubmit}>

                            <div className='relative flex items-center w-full h-[3rem]'>
                                <input value={password} onChange={handlePasswordChange} type={showPassword ? 'text' : 'password'} className='w-full h-full bg-[#e9e9e9] dark:bg-white rounded px-2 text-lg focus:outline-none focus:border-2 border-black/60' placeholder={t('passwordReset.text8') as string}></input>

                                <div onClick={() => setShowPassword(!showPassword)} className="absolute right-4">
                                    {showPassword ? (
                                        <AiOutlineEye size={20} className="cursor-pointer hover:scale-105 transition ease-in-out duration-300" />
                                    ) : (
                                        <AiOutlineEyeInvisible size={20} className="cursor-pointer hover:scale-105 transition ease-in-out duration-300" />
                                    )}
                                </div>
                            </div>

                            <div className='relative flex items-center w-full h-[3rem]'>

                                <input type={showPasswordSec ? 'text' : 'password'} value={secPassword} onChange={handleSecPasswordChange} className='w-full h-full bg-[#e9e9e9] dark:bg-white rounded px-2 text-lg focus:outline-none focus:border-2 border-black/60' placeholder={t('passwordReset.text9') as string}></input>

                                <div onClick={() => setShowPasswordSec(!showPasswordSec)} className="absolute right-4">
                                    {showPasswordSec ? (
                                        <AiOutlineEye size={20} className="cursor-pointer hover:scale-105 transition ease-in-out duration-300" />
                                    ) : (
                                        <AiOutlineEyeInvisible size={20} className="cursor-pointer hover:scale-105 transition ease-in-out duration-300" />
                                    )}
                                </div>

                            </div>
                            {message && <p className='text-red-500 text-sm mt-2 ml-2'>{message}</p>}
                            {errorsServer && <p className="text-red-500 text-sm mt-2 ml-2">{errorsServer}</p>}

                            {errorsVadlidationServer.map((error, index) => (
                                <p key={index} className="text-red-500 text-sm mt-2 ml-2">{error.msg}</p>
                            ))}

                            <button type="submit" disabled={isSubmittingButton} className='w-full h-[3rem] bg-black/80 rounded hover:scale-105 transform ease-in-out duration-300'>
                                <div className='flex items-center justify-center'>
                                    {isSubmittingButton && (<CircleSvg color="black" secColor='black' />)}
                                    <p className='text-white text-lg'>{t('passwordReset.text7')}</p>
                                </div>
                            </button>
                        </form>
                    </div>)
                : (<div className='flex flex-col  items-center'>
                    <p className='text-2xl md:text-4xl lg:text-5xl text-center text-black/80 dark:text-white/60 mb-4'>{t('passwordReset.text11')}</p>
                    <LazyLoadImage
                        src={theme === 'dark' ? image_dark : image}
                        alt="Photo time out"
                        className="w-[15rem] h-[15rem] lg:w-[20rem] lg:h-[20rem]"
                        effect="blur"
                        placeholderSrc={image} />

                    <p className='text-lg md:text-xl lg:text-2xl text-black/60 dark:text-white/60 mb-2'>{t('passwordReset.text12')}</p>
                    <p className='text-lg md:text-xl lg:text-2xl text-black/60 dark:text-white/60'>{t('passwordReset.text13')}</p>

                    <button onClick={() => navigate("/login")} type="button" className='flex items-center text-xl lg:text-2xl rounded-full bg-[#97DEFF] shadow-button w-auto px-4 h-[3rem] mt-10 transform hover:scale-110 transition ease-out duration-300 '>
                        <p className='text-black/80 ' >{t('passwordReset.text14')}</p>
                    </button>
                </div>



                )}
        </div>
    );
}

export default ResetPassword;