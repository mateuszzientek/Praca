import React, { useContext } from 'react';
import { ThemeContext } from '../elements/ThemeContext';

interface InputCheckoutProps {
    placeholder: string;
    extra: string;
    value: string;
    error: string
    onChange: (value: string) => void;
    handleBlur: () => void;
}

function InputCheckout(props: InputCheckoutProps) {
    const { theme, setTheme } = useContext(ThemeContext);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        props.onChange(newValue);
    };

    return (
        <>
            <label className={`relative`}>
                <input
                    type="text"
                    value={props.value}
                    onChange={handleChange}
                    onBlur={props.handleBlur}
                    className={`border-[1px] px-4 border-black/30 dark:border-white/50 h-[3rem] ${props.extra} mt-6 bg-transparent outline-none transition duration-200 dark:text-white `}
                />
                <span className={`text-base cursor-auto text-black dark:text-white text-opacity-80 absolute left-0 -top-1 mx-4 transition duration-200 ${theme === "dark" ? "input-text-dark" : "input-text-light"} ${props.value ? 'input-text-active' : ''}`}>{props.placeholder}</span>

            </label>
            {props.error && (
                <p className="text-red-500 text-sm mt-1 ">
                    {props.error}
                </p>
            )}
        </>
    );
}

export default InputCheckout;