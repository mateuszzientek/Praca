import React from 'react';
import { BsFacebook, BsInstagram } from 'react-icons/bs'
import { GiConverseShoe } from 'react-icons/gi'
import { AiFillTwitterCircle, AiFillInstagram } from 'react-icons/ai'
import logo from '../assets/images/logo2.png';


function Footer(props) {

    let iconStyles = { color: "white" };

    return (
        <div>

            <div className='flex justify-center  bg-black/90 md:h-36 py-6'>

                <div className='flex flex-col md:flex-row justify-between items-center md:w-[90%] lg:w-[80%] 2xl:w-[90rem] space-y-3  '>
                    <div className='flex items-center space-x-4 '>
                        <BsFacebook className="cursor-pointer hover:scale-125 transition ease-out duration-300" style={iconStyles} size={40} />
                        <AiFillTwitterCircle className="cursor-pointer hover:scale-125 transition ease-out duration-300" style={iconStyles} size={46} />
                        <BsInstagram className="cursor-pointer hover:scale-125 transition ease-out duration-300" style={iconStyles} size={40} />
                    </div>

                    <div className='flex items-center space-x-2'>
                        <img src={logo} className='h-[6rem] w-[15rem]' />
                    </div>

                    <div className='flex text-2xl space-x-4 text-white '>
                        <p className='cursor-pointer hover:border-b-2 '>Delivery</p>
                        <p className='cursor-pointer hover:border-b-2 '>Return</p>

                    </div>

                </div>

            </div>

            <div className='flex justify-center items-center bg-black/95 h-[3rem] '>
                <p className='text-white/80 text-xl'>© SneakersZone. All rights reserved. </p>
            </div>
        </div>
    );
}

export default Footer;