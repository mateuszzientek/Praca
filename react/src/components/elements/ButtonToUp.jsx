import React from 'react';
import ScrollToTop from "react-scroll-up";
import { AiOutlineArrowUp } from "react-icons/ai";

function ButtonToUp(props) {
    return (
        <ScrollToTop showUnder={800} duration={700} style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: '9999' }}>
            <div className='bg-[#97DEFF] rounded-full p-2 shadow-button transform hover:scale-125 hover:bg-[#48c5fe] transition ease-out duration-300'>
                <AiOutlineArrowUp size={25} />
            </div>
        </ScrollToTop>
    );
}

export default ButtonToUp;