import React from 'react';
import { NavLink } from "react-router-dom";

function MobileLink(props) {
    return (
        <div className='px-4 hover:bg-black/10 hover:dark:bg-white/20'>
            <NavLink to={props.link}
                style={({ isActive }) => {
                    return isActive ? { fontWeight: "700", pointerEvents: "none" } : {}
                }}
                className='text-black dark:text-white text-xl py-4 flex group transition duration-300 hover:scale-105'> {props.icon} {props.text}
            </NavLink>
        </div>
    );
}

export default MobileLink;