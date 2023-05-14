import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

function QuestionsSection() {

    const { theme, setTheme } = useContext(ThemeContext);

    return (
        <div className={`flex justify-center text-center h-[75rem] md:h-[50rem]   ${theme === 'dark' ? "questions-background-black questions-background-mobile-black" : "questions-background questions-background-mobile"}`}>

            {/* main text */}

            <div className="flex flex-col items-center md:mr-[40rem] md:ml-[20rem] lg:ml-[13rem] xl:ml-[8rem] pt-20 font-roboto font-bold text-black/70 dark:text-white">
                <p className="text-5xl md:text-5xl xl:text-7xl ">Questions? Write!</p>
                <p className="mt-10 text-lg md:text-xl lg:text-2xl xl:text-3xl w-[30rem] md:w-[23rem] lg:w-[32rem] xl:w-[40rem] mx-auto">If you have any questions, feel free to write to us! We will respond to them as quickly as we can!</p>

                <div className="flex justify-center space-x-10 mt-10 items-center">

                    {/* name and surname buttons */}

                    <input className='px-3 w-[13rem] md:w-[10rem] lg:w-[13rem] h-[3rem] rounded-full shadow-button focus:outline-none focus:border-2 border-black/60' type="text" placeholder='Name' />

                    <input className='px-3 w-[13rem] md:w-[10rem] lg:w-[13rem] h-[3rem] rounded-full shadow-button focus:outline-none focus:border-2 border-black/60' type="text" placeholder='Surname' />

                </div>

                {/* email button */}

                <input className='px-3 w-[20rem] md:w-[17rem] lg:w-[20rem] h-[3rem] rounded-full shadow-button focus:outline-none mt-10 focus:border-2 border-black/60' type=" email" placeholder='Your Email' />

                {/* body email input */}

                <textarea className="p-2 mt-10 shadow-button rounded-2xl focus:outline-none focus:border-2 border-black/60 w-[25rem] md:w-[18rem] lg:w-[25rem] h-[7rem]" placeholder='What is your question?'></textarea>

                {/* submit button */}

                <button type="button" className='text-2xl rounded-full bg-[#97DEFF] shadow-button w-[6rem] h-[3rem] mt-10 transform hover:scale-110 transition ease-out duration-300 '>
                    <p className='text-black/80' >Send!</p>
                </button>


            </div>

        </div>
    )
}

export default QuestionsSection;