import React, { useState, useContext, useEffect } from 'react';
import { LoginContext } from '../elements/LoginProvider';
import { ThemeContext } from '../elements/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BsArrowLeft } from 'react-icons/bs';
import { AiOutlineEyeInvisible, AiOutlineEye, AiOutlineHome } from 'react-icons/ai';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import zdjecie from '../../assets/images/pp.jpg';
import chrome from '../../assets/images/chrome.png';
import axios from 'axios';
import validator from 'validator';
import LoginCompleted from '../elements/LoginCompleted';
import { AxiosRequestConfig } from 'axios';
import { UserContext } from '../elements/UserProvider';
import ResetPasswordDiv from '../elements/ResetPasswordDiv';
import CircleSvg from '../elements/CircleSvg';


interface Error {
    msg: string;
    type: string;
    value: string;
    path: string;
    location: string;
}


function Login() {

    const navigate = useNavigate();
    const { t } = useTranslation();

    const { theme, setTheme } = useContext(ThemeContext);
    const { isLoginSelected, setLoginSelected } = useContext(LoginContext);
    const [showPassword, setShowPassword] = useState(false);
    const [emailOffert, setEmailOffert] = useState(false);
    const [isUserSaved, setIsUserSaved] = useState(false);
    const [isUserLogined, setIsUserLogined] = useState(false);
    const [isForgotPasswordClicked, setIsForgotPasswordClicked] = useState(false);
    const [errors, setErrors] = useState({ email: '', pass: '', name: '', surname: '', resetEmail: '' });
    const [errorsVadlidationServer, setErrorsVadlidationServer] = useState<Error[]>([]);
    const [errorsServer, setErrorsServer] = useState("");
    const { setUser, setIsUserLoggedIn } = useContext(UserContext);
    const [isSubmittingReset, setIsSubmittingReset] = useState(false);
    const [showInfoReset, setShowInfoReset] = useState(false);
    const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
    const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [resetEmail, setResetEmail] = useState('');


    const handleEmailOffertChange = () => {
        setEmailOffert(!emailOffert); // Odwróć wartość stanu przy każdej zmianie
    };


    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);

    };

    const handleSurnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSurname(event.target.value);

    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);

    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleResetEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setResetEmail(event.target.value);
    };

    const validateData = () => {
        const newErrors = {
            email: '',
            pass: '',
            name: '',
            surname: '',
            resetEmail: ''
        };

        if (email && !validator.isEmail(email)) {
            newErrors.email = t('loginError.email');
        }

        if (resetEmail && !validator.isEmail(resetEmail)) {
            newErrors.resetEmail = t('loginError.email');
        }

        if (name && !/^[a-zA-Z]+$/.test(name)) {
            newErrors.name = t('loginError.name');
        }

        if (surname && !/^[a-zA-Z]+$/.test(surname)) {
            newErrors.surname = t('loginError.surname');
        }

        if (password && !validator.isStrongPassword(password, { minSymbols: 0 })) {
            newErrors.pass = t('loginError.pass');
        }



        setErrors(newErrors);

        // Zwróć true, jeśli nie ma żadnych błędów walidacji, w przeciwnym razie false
        return Object.keys(newErrors.email || newErrors.name || newErrors.surname || newErrors.pass).length === 0;
    };

    const handleRessetPassword = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const isValid = validateData();

        if (!resetEmail) {
            setErrors({
                email: '',
                pass: '',
                name: '',
                surname: '',
                resetEmail: !resetEmail ? t('loginError.emailReq') : ''
            })
            return;
        }

        if (isValid) {
            setIsSubmittingReset(true);

            const userData = {
                email: resetEmail,
            };


            axios
                .post("/resetPassword", userData, { withCredentials: true } as AxiosRequestConfig)
                .then((response) => {
                    setResetEmail("")
                    setErrorsServer("")
                    setErrorsVadlidationServer([])
                    setShowInfoReset(true);
                    setTimeout(() => {
                        setShowInfoReset(false);
                    }, 2500);

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
                    setIsSubmittingReset(false);
                });
        }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Waliduj dane przed wysłaniem formularza
        const isValid = validateData();


        //logowanie
        if (isLoginSelected) {

            if (!email || !password) {
                // Przynajmniej jedno z pól jest puste
                setErrors({
                    email: !email ? t('loginError.emailReq') : '',
                    pass: !password ? t('loginError.passReq') : '',
                    name: '',
                    surname: '',
                    resetEmail: ''
                });
                return; // Zwracamy funkcję, jeśli którekolwiek pole jest puste
            }


            if (isValid) {

                setIsSubmittingLogin(true)

                const userData = {
                    password: password,
                    email: email,
                };

                axios
                    .post('/login', userData, { withCredentials: true } as AxiosRequestConfig)
                    .then((response) => {
                        setErrorsServer("");
                        setErrorsVadlidationServer([])
                        setIsUserLogined(true);
                        setIsUserLoggedIn(true)

                        const { _id, name, surname, email, role, newsletter, email_offert } = response.data.user;

                        const user = {
                            _id: _id || "",
                            name: name || "",
                            surname: surname || "",
                            email: email || "",
                            role: role || "",
                            newsletter: newsletter || false,
                            email_offert: email_offert || false,
                        };

                        setUser(user);


                        setTimeout(() => {
                            navigate("/");
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
                        setIsSubmittingLogin(false)
                    });;
            }



            //rejestracja    
        } else {

            if (!email || !password || !name || !surname) {
                // Przynajmniej jedno z pól jest puste
                setErrors({
                    email: !email ? t('loginError.emailReq') : '',
                    pass: !password ? t('loginError.passReq') : '',
                    name: !name ? t('loginError.nameReq') : '',
                    surname: !surname ? t('loginError.surnameReq') : '',
                    resetEmail: ''
                });
                return; // Zwracamy funkcję, jeśli którekolwiek pole jest puste
            }

            if (isValid) {
                setIsSubmittingRegister(true)

                const userData = {
                    name: name,
                    surname: surname,
                    password: password,
                    email: email,
                    role: 'user',
                    email_offert: emailOffert,
                };

                axios
                    .post('/register', userData, { withCredentials: true } as AxiosRequestConfig)
                    .then((response) => {
                        setErrorsServer("");
                        setErrorsVadlidationServer([])
                        setIsUserSaved(true);
                        setTimeout(() => {
                            window.location.reload();
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
                        setIsSubmittingRegister(false)
                    });
            }
        }
    }

    const handleBlur = () => {
        validateData();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChooseClick = () => {
        const newErrors = {
            email: '',
            pass: '',
            name: '',
            surname: '',
            resetEmail: ''
        };

        setErrors(newErrors);

        setSurname("");
        setPassword("");
        setEmail("");
        setName("")
        setErrorsServer('')
        setErrorsVadlidationServer([])

    };

    return (
        <>
            {isForgotPasswordClicked &&
                (<ResetPasswordDiv
                    mainText={t('passwordReset.text1')}
                    text={t('passwordReset.text2')}
                    textButton={t('passwordReset.text1')}
                    textEmail={t('login.email')}
                    errors={errors.resetEmail}
                    errorsServer={errorsServer}
                    errorsValidationServer={errorsVadlidationServer}
                    onResetPassword={() => {
                        setIsForgotPasswordClicked(!isForgotPasswordClicked)
                        setResetEmail('')
                        setErrorsServer('')
                        setErrorsVadlidationServer([])
                        setErrors({
                            email: '',
                            pass: '',
                            name: '',
                            surname: '',
                            resetEmail: ''
                        });
                    }}
                    value={resetEmail}
                    onBlur={handleBlur}
                    onChange={handleResetEmailChange}
                    handleRessetPassword={handleRessetPassword}
                    disabled={isSubmittingReset}
                    showInfoReset={showInfoReset}

                />)}

            {isUserSaved && (
                <LoginCompleted main={t('login.text8')} text={t('login.text9')} />
            )}

            {isUserLogined && (
                <LoginCompleted main={t('login.text10')} text={t('login.text11')} />
            )}




            <div className="bg-[#ececec] dark:bg-black/80 w-screen min-h-screen flex items-center justify-center ">

                <div className='absolute left-10 top-8 '>
                    <div onClick={() => navigate("/")} className='flex items-center space-x-2 cursor-pointer hover:scale-105 transform ease-in-out duration-300'>
                        <p className='text-xl text-black dark:text-white'>{t('passwordReset.text5')}</p>
                        <AiOutlineHome size={20} color={theme === 'dark' ? "white" : "black"} />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row my-20 w-[90%] lg:w-[80%] 2xl:w-[60%] h-screen/2 shadow-button rounded-3xl animate-fade-in-long">
                    <div className="relative flex justify-center w-full h-[15rem] lg:h-auto lg:w-[50%] ">
                        <img alt="Photo of ocean" className="object-cover w-full h-full rounded-t-3xl lg:rounded-r-none lg:rounded-l-3xl " src={zdjecie} />
                    </div>



                    <div className="flex flex-col items-center bg-white dark:bg-black/60 w-full lg:w-[50%]  xl:w-[50%] rounded-b-3xl lg:rounded-l-none lg:rounded-r-3xl">


                        <p className="text-black dark:text-white text-3xl xl:text-4xl pt-10">
                            {isLoginSelected ? t('login.textlogin') : t('login.textregister')}
                        </p>

                        <div className="flex mt-10 text-2xl font-lato mb-2">
                            <button
                                className={`px-8 py-4 border-b-2  dark:hover:text-[#72cff7] hover:text-[#72cff7] ${isLoginSelected ? " border-[#72cff7]  text-[#72cff7]" : "border-black/30 dark:border-white text-black/70 dark:text-white"}`}
                                onClick={() => {
                                    handleChooseClick()
                                    setLoginSelected(true);
                                }}
                            >
                                {t('login.signin')}
                            </button>
                            <button
                                className={`px-8 py-4 border-b-2  dark:hover:text-[#72cff7] hover:text-[#72cff7] ${isLoginSelected ? "border-black/30 dark:border-white text-black/70 dark:text-white" : "border-[#72cff7]  text-[#72cff7]"}`}

                                onClick={() => {
                                    handleChooseClick()
                                    setLoginSelected(false);
                                }}
                            >
                                {t('login.signup')}
                            </button>
                        </div>

                        <form className="w-[70%]" onSubmit={handleSubmit}>
                            {!isLoginSelected && (
                                <input
                                    value={name}
                                    onBlur={handleBlur}
                                    onChange={handleNameChange}
                                    className={`mt-6 w-[100%] h-[3rem] bg-[#e9e9e9] px-4 rounded-3xl focus:outline-none focus:border-2 border-black/60 ${errors.name && "border-2 border-red-400"}`}
                                    placeholder={t('login.name') as string}
                                />

                            )}

                            {!isLoginSelected && (
                                errors.name && <p className="text-red-500 text-sm mt-2 ml-2">{errors.name}</p>
                            )}

                            {!isLoginSelected && (
                                <input
                                    value={surname}
                                    onBlur={handleBlur}
                                    onChange={handleSurnameChange}
                                    className={`mt-6 w-[100%] h-[3rem] bg-[#e9e9e9] px-4 rounded-3xl focus:outline-none focus:border-2 border-black/60 ${errors.surname && "border-2 border-red-400"}`}
                                    placeholder={t('login.surname') as string}
                                />

                            )}

                            {!isLoginSelected && (
                                errors.surname && <p className="text-red-500 text-sm mt-2 ml-2">{errors.surname}</p>
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


                            {errorsServer && <p className="text-red-500 text-sm mt-2 ml-2">{errorsServer}</p>}

                            {errorsVadlidationServer.map((error, index) => (
                                <p key={index} className="text-red-500 text-sm mt-2 ml-2">{error.msg}</p>
                            ))}

                            {isLoginSelected && (
                                <button
                                    type="submit"
                                    className="mt-6 w-[100%] h-[3rem] bg-black/80 dark:bg-[#72cff7] px-4 rounded-3xl hover:scale-105 transition ease-in-out duration-300"
                                >

                                    <div className='flex items-center justify-center'>
                                        {isSubmittingLogin && (<CircleSvg color="white" secColor='white' />)}
                                        <p className="text-white dark:text-black font-lato text-xl">{t('login.signin')}</p>
                                    </div>
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
                                    <div className='flex items-center justify-center'>
                                        {isSubmittingRegister && (<CircleSvg color="white" secColor='white' />)}
                                        <p className="text-white dark:text-black font-lato text-xl">{t('login.create')}</p>
                                    </div>
                                </button>
                            )}
                        </form>

                        {!isLoginSelected && (
                            <p className="font-lato w-[70%] text-sm mt-6 text-black dark:text-white ">
                                {t('login.text4')} <span className="font-bold">{t('login.text5')}</span> {t('login.text6')} <span className="font-bold">{t('login.text7')}</span> .
                            </p>
                        )}

                        {isLoginSelected && (
                            <button onClick={() => setIsForgotPasswordClicked(!isForgotPasswordClicked)} className="text-black dark:text-white font-lato text-xl mt-6 hover:scale-105 transition ease-in-out duration-300">{t('login.forgot')}</button>
                        )}




                        <div className='flex items-center justify-center w-[60%] mt-10'>
                            <div className="border-b border-black/50 dark:border-white  w-[20%]"></div>
                            <p className='text-base px-2 text-black dark:text-white '>{isLoginSelected ? t('login.text2') : t('login.text3')} </p>
                            <div className="border-b border-black/50 dark:border-white w-[20%]"></div>
                        </div>

                        <button onClick={() => { window.open("http://localhost:5000/auth/google", "_self") }} className='flex items-center justify-center space-x-2 mt-10 mb-10 w-[70%] h-[3rem] bg-white border-black border-2  px-4 rounded-3xl hover:scale-105 transition ease-in-out duration-300'>
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
