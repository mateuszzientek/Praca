import React from 'react';

function HeroLink(props) {
    return (
        <a href='' className='text-black dark:text-white xl:px-4 2xl:px-8 hover:font-bold transform hover:scale-105 hover:ease-out duration-100'>{props.text}</a>
    );
}

export default HeroLink;