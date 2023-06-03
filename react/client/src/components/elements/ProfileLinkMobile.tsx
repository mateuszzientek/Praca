import React from 'react';
import { Link } from "react-router-dom";

interface ProfileLinkProps {
    text: string
    link: string
}

function ProfileLinkMobile(props: ProfileLinkProps) {
    return (
        <Link className='text-xl whitespace-nowrap  hover:scale-110 transition ease-in-out duration-300 ' to={props.link}>{props.text}</Link>
    );
}

export default ProfileLinkMobile;