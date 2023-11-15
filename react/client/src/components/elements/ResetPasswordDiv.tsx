import React, { useContext } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { ThemeContext } from './ThemeContext';
import { useTranslation } from 'react-i18next';
import InfoDivBottom from './InfoDivBottom';
import CircleSvg from './CircleSvg';

interface ResetPasswordDivProps {
    mainText: string,
    text: string,
    textButton: string,
    textEmail: string,
    value: string;
    errors: string;
    errorsServer: string;
    disabled: boolean
    showInfoReset: boolean
    errorsValidationServer: { msg: string }[];
    onBlur: () => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onResetPassword: () => void;
    handleRessetPassword: (event: React.FormEvent<HTMLFormElement>) => void
}

function ResetPasswordDiv(props: ResetPasswordDivProps) {

    const { theme } = useContext(ThemeContext);
    const { t } = useTranslation()

    return (
        <div className="bg-black/40 backdrop-blur-sm fixed w-full h-screen z-10 flex justify-center items-center ">
            <div className="relative flex flex-col  items-center bg-white dark:bg-black w-[25rem] h-[27rem] lg:w-[35rem] lg:h-[28rem] xl:w-[45rem] xl:h-[30rem] rounded-2xl">
                <div onClick={props.onResetPassword}>
                    <AiOutlineClose size={30} color={theme === 'dark' ? "white" : "black"} className='absolute right-8 top-6 cursor-pointer hover:scale-125' />
                </div>
                <p className='text-black dark:text-white mt-12 text-3xl xl:text-4xl'>{props.mainText}</p>
                <p className='mt-10 w-[80%] text-center text-lg lg:text-xl xl:text-2xl text-black/60 dark:text-white/70'>{props.text}</p>
                <form className='w-[70%]' onSubmit={props.handleRessetPassword}>
                    <input
                        type="email"
                        value={props.value}
                        onBlur={props.onBlur}
                        onChange={props.onChange}
                        className={`mt-10 w-full h-[4rem] bg-[#e9e9e9] px-4 rounded focus:outline-none focus:border-2 border-black/60 `}
                        placeholder={props.textEmail}
                    />
                    {props.errors && (<p className="text-red-500 text-sm mt-4 ">{props.errors}</p>)}

                    {props.errorsServer && <p className="text-red-500 text-sm mt-2 ml-2">{props.errorsServer}</p>}

                    {props.errorsValidationServer.map((error, index) => (
                        <p key={index} className="text-red-500 text-sm mt-2 ml-2">{error.msg}</p>
                    ))}

                    <button type="submit" disabled={props.disabled} className={`mt-10 w-full h-[4rem] px-4 rounded bg-black/90 dark:bg-white/80 hover:bg-black/80 dark:hover:bg-white`} >
                        <div className='flex items-center justify-center'>
                            {props.disabled && (<CircleSvg color="white" secColor='white' />)}

                            <p className='text-xl text-white dark:text-black '>{props.textButton}</p>
                        </div>
                    </button>
                </form>
            </div>

            {props.showInfoReset && (<InfoDivBottom color={"bg-green-500"} text={t('passwordReset.text10')} />)}

        </div>
    );
}

export default ResetPasswordDiv;