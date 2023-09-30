import React, { useContext, useState } from "react";
import { ThemeContext } from "../elements/ThemeContext";
import { useTranslation } from "react-i18next";
import axios from 'axios';
import validator from 'validator';
import InfoDivBottom from '../elements/InfoDivBottom';
import CircleSvg from '../elements/CircleSvg';
import { AddressInterface, ErrorInterface } from "src/types";


function QuestionsSection() {

    const { theme, setTheme } = useContext(ThemeContext);
    const { t } = useTranslation()

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [text, setText] = useState("");
    const [message, setMessage] = useState("");
    const [showInfo, setshowInfo] = useState(false);
    const [showLoading, setLoading] = useState(false);
    const [errorsVadlidationServer, setErrorsVadlidationServer] = useState<ErrorInterface[]>([]);
    const [errorsServer, setErrorsServer] = useState("");

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }
    const handleSurnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSurname(event.target.value)
    }
    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value)
    }

    const validateData = () => {
        setMessage("");

        if (email && !validator.isEmail(email)) {
            const message = t('loginError.email')
            setMessage(message);
            return false;
        }

        if (name && !/^[a-zA-Z]+$/.test(name)) {
            const message = t('loginError.name')
            setMessage(message);
            return false;
        }

        if (surname && !/^[a-zA-Z]+$/.test(surname)) {
            const message = t('loginError.surname')
            setMessage(message);
            return false;
        }

        return true;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        if (!email || !name || !surname || !text) {
            const message = t('emailQuestion.error');
            setMessage(message);
            return;
        }

        if (!validateData()) {
            return;
        }

        const data = {
            name: name,
            surname: surname,
            email: email,
            text: text
        };

        setLoading(true)

        axios.post("/emailQuestion", data)
            .then((response) => {
                setEmail('')
                setName('')
                setSurname('')
                setText('')

                setshowInfo(true)
                setTimeout(() => {
                    setshowInfo(false);
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
                setLoading(false)
            })
    }

    return (
        <div className={`flex justify-center text-center h-[75rem] md:h-[50rem]   ${theme === 'dark' ? "questions-background-black questions-background-mobile-black" : "questions-background questions-background-mobile"}`}>

            {showInfo && (<InfoDivBottom color={"bg-green-500"} text={t('emailQuestion.successful')} />)}


            {/* main text */}

            <div className="flex flex-col items-center  md:mr-[40rem]  md:ml-[20rem] lg:ml-[13rem] xl:ml-[8rem] pt-20 font-roboto font-bold">
                <p className="text-5xl md:text-5xl xl:text-7xl text-black/70 dark:text-white">{t('questionSection.main')}</p>
                <p className=" text-black/50 mt-10 dark:text-white/70 text-lg md:text-xl lg:text-2xl xl:text-3xl w-[25rem] sm:w-[30rem] md:w-[23rem] lg:w-[32rem] xl:w-[40rem] mx-auto">{t('questionSection.text')}</p>

                <form onSubmit={handleSubmit}>

                    <div className="flex justify-center space-x-10 mt-10 items-center ">

                        {/* name and surname buttons */}

                        <input value={name} onChange={handleNameChange} className='px-3 w-[10rem] sm:w-[13rem] md:w-[10rem] lg:w-[13rem] h-[3rem] rounded-full shadow-button focus:outline-none focus:border-2 border-black/60' type="text" placeholder={t('questionSection.name') as string} />

                        <input value={surname} onChange={handleSurnameChange} className='px-3 w-[10rem] sm:w-[13rem] md:w-[10rem] lg:w-[13rem] h-[3rem] rounded-full shadow-button focus:outline-none focus:border-2 border-black/60' type="text" placeholder={t('questionSection.surname') as string} />

                    </div>

                    {/* email button */}

                    <div className="flex flex-col items-center">

                        <input value={email} onChange={handleEmailChange} className='px-3 w-[20rem] md:w-[17rem] lg:w-[20rem] h-[3rem] rounded-full shadow-button focus:outline-none mt-10 focus:border-2 border-black/60' type="email" placeholder={t('questionSection.email') as string} />

                        {/* body text input */}

                        <textarea value={text} onChange={handleTextChange} className="p-2 mt-10 shadow-button rounded-2xl focus:outline-none focus:border-2 border-black/60 w-[25rem] md:w-[18rem] lg:w-[25rem] h-[7rem]" placeholder={t('questionSection.question') as string}></textarea>

                        {/* submit button */}

                        {message && <p className='text-red-500 text-base mt-4'>{message}</p>}

                        {errorsServer && <p className="text-red-500 text-base ">{errorsServer}</p>}

                        {errorsVadlidationServer.map((error, index) => (
                            <p key={index} className="text-red-500 text-base ">{error.msg}</p>
                        ))}

                        <button
                            type="submit"
                            disabled={showLoading}
                            className='text-2xl rounded-full bg-[#97DEFF] disabled:bg-[#c9c9c9] shadow-button px-6 h-[3rem] mt-10 transform hover:scale-110 transition ease-out duration-300 '>
                            <div className='flex items-center justify-center'>
                                {showLoading && (<CircleSvg color="black" secColor='black' />)}
                                <p className='text-black/80' >{t('questionSection.button')}</p>
                            </div>
                        </button>
                    </div>

                </form>


            </div>

        </div>
    )
}

export default QuestionsSection;