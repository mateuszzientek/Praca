import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

function ToogleButton(props) {
    const [isSeleceted, setIsSelected] = useState(false);

    const { theme, setTheme } = useContext(ThemeContext);

    useEffect(() => {
        (theme === 'dark' ? setIsSelected(true) : setIsSelected(false))
    }, [theme])

    const handleClick = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <div
            onClick={handleClick}
            className={`flex w-16 h-8 bg-gray-300 mx-4 rounded-full cursor-pointer ${isSeleceted ? "bg-[#48c5fe]" : "bg-gray-300"}`}>
            <span className={`h-8 w-8 bg-white rounded-full transition-all duration-500 shadow-2xl ${isSeleceted ? "ml-[2.1rem]" : "ml-0"}`}></span>
        </div>
    );
}

export default ToogleButton;