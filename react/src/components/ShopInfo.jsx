import React from 'react';

function ShopInfo(props) {
    return (

        <div className=' flex items-center pr-4'>
            {props.icon}
            <div className={`sm:flex text-center ${props.border}  border-black pr-2`}>
                <h2 className='md:text-sm  lg:text-lg xl:text-xl px-1 '>{props.text1}</h2>
                <h2 className='md:text-sm lg:text-lg xl:text-xl flex px-1 '>{props.text2}</h2>
            </div>

        </div>
    );
}

export default ShopInfo;