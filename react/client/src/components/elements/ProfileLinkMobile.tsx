import React from 'react';
import { Link } from "react-router-dom";

interface ProfileLinkProps {
    text: string
    link: string
}

function ProfileLinkMobile(props: ProfileLinkProps) {
    return (
        <Link className='text-xl whitespace-nowrap text-black/80 dark:text-white/80  hover:bg-black/10  dark:hover:bg-white/20 w-full pl-4 py-2' to={props.link}>{props.text}</Link>
    );
}

export default ProfileLinkMobile;