import React from 'react';
import {
    AiOutlineCheck, AiOutlineClose
} from "react-icons/ai";

interface ToogleButtonSwoshProps {
    isSwooshVisible: boolean
    setIsSwooshVisible: (newState: boolean) => void;
    setSideView: (side: string) => void
    side: string
}

function ToogleButtonSwosh(props: ToogleButtonSwoshProps) {

    const handleClick = () => {
        props.setIsSwooshVisible(!props.isSwooshVisible)
        props.setSideView(props.side)
    }

    return (
        <div
            onClick={() => handleClick()}
            className={`flex items-center w-16 h-9 mx-4 rounded-full cursor-pointer ${props.isSwooshVisible ? "bg-[#e3ffdc]" : "bg-gray-300"}`}>
            <div className={`flex justify-center items-center h-8 w-8  rounded-full transition-all duration-500 shadow-2xl ${props.isSwooshVisible ? "ml-[1.8rem] bg-[#58ff2f]" : "ml-[0.2rem]  bg-[#5a5a5a]"}`}>

                {props.isSwooshVisible ? (<AiOutlineCheck size={25} color="white" />) : (<AiOutlineClose size={25} color="white" />)}

            </div>

        </div>
    );
}

export default ToogleButtonSwosh;