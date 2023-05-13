import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { BsMoon, BsSun } from 'react-icons/bs';

function ToogleDarkButton(props) {

    const { theme, setTheme } = useContext(ThemeContext);

    return (
        <>
            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className='flex justify-center items-center bg-[white]  rounded-full w-[2.5rem] h-[2.5rem] mr-4 shadow-xl'>
                {theme === 'dark' ? (<BsMoon size={20} />) : (<BsSun size={20} />)}
            </button>


        </>
    );
}

export default ToogleDarkButton;