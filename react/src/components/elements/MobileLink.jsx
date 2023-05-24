import React from 'react';

function MobileLink(props) {
    return (
        <div className='px-4 hover:bg-black/10 hover:dark:bg-white/20'>
            <a href='' className='text-black dark:text-white text-xl py-4 flex group transition duration-300 hover:scale-105'> {props.icon} {props.text}
            </a>
        </div>
    );
}

export default MobileLink;