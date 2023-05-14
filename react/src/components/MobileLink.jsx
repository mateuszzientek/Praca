import React from 'react';

function MobileLink(props) {
    return (
        <a href='' className='text-black dark:text-white text-xl py-4 flex hover:font-bold transform hover:scale-105 hover:ease-out duration-100'> {props.icon} {props.text}</a>

    );
}

export default MobileLink;