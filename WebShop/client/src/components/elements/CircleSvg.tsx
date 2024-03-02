import React from 'react';

interface CircleSvgProps {
    color: string,
    secColor: string,
}

function CircleSvg(props: CircleSvgProps) {
    return (
        <svg className="w-5 h-5 text-white animate-spin mr-2" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-50" cx="12" cy="12" r="10" stroke={props.color} strokeWidth="4"></circle>
            <path className="opacity-50" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill={props.secColor}></path>
        </svg>
    );
}

export default CircleSvg;
