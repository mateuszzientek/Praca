import React, { useEffect, useState } from 'react';
import { AiOutlineArrowUp } from "react-icons/ai";
import { animateScroll as scroll } from 'react-scroll';

function ButtonToUp() {
    const [backToTopButton, setbackToTopButton] = useState(false);

    const scrollUp = () => {
        scroll.scrollToTop({
            smooth: true,
            duration: 500
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 800) {
                setbackToTopButton(true);
            } else {
                setbackToTopButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            {backToTopButton && (
                <button
                    onClick={scrollUp}
                    className={`bg-[#97DEFF] fixed bottom-[30px] right-[30px] z-10 rounded-full p-2 shadow-button transform hover:scale-125  hover:bg-[#48c5fe] transition ease-out duration-300`}
                >
                    <AiOutlineArrowUp size={25} />
                </button>
            )}
        </>
    );
}

export default ButtonToUp;