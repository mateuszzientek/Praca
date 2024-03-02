import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { BsMoon, BsSun } from 'react-icons/bs';

function ToggleDarkButton() {
    const { theme, setTheme } = useContext(ThemeContext);

    const handleClick = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <button onClick={handleClick} className='hidden md:flex justify-center items-center bg-[white]  rounded-full w-[2.5rem] h-[2.5rem] sm:mx-4 shadow-xl hover:scale-110 transition ease-in-out duration-300'>
            {theme === 'dark' ? <BsSun size={20} /> : <BsMoon size={20} />}
        </button>
    );
}

export default ToggleDarkButton;