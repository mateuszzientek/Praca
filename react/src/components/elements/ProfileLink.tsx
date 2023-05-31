import React from 'react';
import { Link } from "react-router-dom";

interface ProfileLinkProps {
    text: string
    link: string
}

function ProfileLink(props: ProfileLinkProps) {
    return (
        <Link className='text-lg whitespace-nowrap px-2 hover:scale-110 transition ease-in-out duration-300 ' to={props.link}>{props.text}</Link>
    );
}

export default ProfileLink;