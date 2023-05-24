import React from 'react';
import { NavLink } from "react-router-dom";

function HeroLink(props) {
    return (

        <NavLink
            to={props.link}
            style={({ isActive }) => {
                return isActive ? { fontWeight: "700", pointerEvents: "none" } : {}
            }}
            className='text-black dark:text-white xl:mx-4 2xl:mx-8 group transition duration-300'>{props.text}
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 dark:bg-white bg-black"></span>
        </NavLink>
    );
}

export default HeroLink;