import React from 'react';
import BounceLoader from "react-spinners/BounceLoader";

function LoadingAnimation() {
    return (
        <div className='flex justify-center w-screen h-screen items-center bg-white dark:bg-[#4f4f4f] '>
            <div>
                <BounceLoader
                    color={"#48c5fe"}
                    size={150}
                />
            </div>

        </div>
    );
}

export default LoadingAnimation;