import React from 'react';
import { BsMoon, BsSun } from 'react-icons/bs';

function ToogleDarkButton(props) {
    return (
        <>
            <button className='flex justify-center items-center bg-[white]  rounded-full w-[2.5rem] h-[2.5rem] mr-4 shadow-xl'>
                <BsMoon size={20} className='' />
                <BsSun size={20} className='hidden' />
            </button>


        </>
    );
}

export default ToogleDarkButton;