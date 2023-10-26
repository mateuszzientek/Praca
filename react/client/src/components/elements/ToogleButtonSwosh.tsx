import React from 'react';
import {
    AiOutlineCheck, AiOutlineClose
} from "react-icons/ai";

interface SwooshVisibility {
    isLeftSwooshVisible: boolean;
    isRightSwooshVisible: boolean;
}

interface ToogleButtonSwoshProps {
    isSwooshVisible: boolean;
    setIsSwooshVisible: (visibility: SwooshVisibility) => void;
    setSideView: (side: string) => void;
    side: string;
    swooshVisibility: SwooshVisibility;
}

function ToogleButtonSwosh(props: ToogleButtonSwoshProps) {
    const handleClick = () => {
        // Zdecyduj, który element obiektu swooshVisibility zaktualizować
        const newSwooshVisibility = { ...props.swooshVisibility };

        if (props.side === "left") {
            newSwooshVisibility.isLeftSwooshVisible = !props.isSwooshVisible;
        } else if (props.side === "right") {
            newSwooshVisibility.isRightSwooshVisible = !props.isSwooshVisible;
        }

        // Teraz możesz przekazać newSwooshVisibility jako nową wartość setIsSwooshVisible
        props.setIsSwooshVisible(newSwooshVisibility);
        props.setSideView(props.side);
    }

    return (
        <div
            onClick={() => handleClick()}
            className={`flex items-center w-16 h-9 mx-4 rounded-full cursor-pointer ${props.isSwooshVisible ? "bg-[#e3ffdc]" : "bg-gray-300"
                }`}
        >
            <div
                className={`flex justify-center items-center h-8 w-8  rounded-full transition-all duration-500 shadow-2xl ${props.isSwooshVisible
                    ? "ml-[1.8rem] bg-[#58ff2f]"
                    : "ml-[0.2rem]  bg-[#5a5a5a]"
                    }`}
            >
                {props.isSwooshVisible ? (
                    <AiOutlineCheck size={25} color="white" />
                ) : (
                    <AiOutlineClose size={25} color="white" />
                )}
            </div>
        </div>
    );
}

export default ToogleButtonSwosh;