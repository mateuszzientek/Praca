import React, { useState } from 'react';
import RoundIcon from "./RoundIcon";
import MobileLink from "./MobileLink";
import HeroLink from "./HeroLink";
import ToogleDarkButton from './ToogleDarkButton';
import { AiOutlineSearch, AiOutlineHeart, AiOutlineClose, AiOutlineMenu, AiFillHome, AiTwotoneShop, AiFillHeart } from 'react-icons/ai';
import { IoPersonOutline } from 'react-icons/io5';
import { BsCart2, BsFillCartFill, BsBookFill, BsFillPersonFill } from "react-icons/bs";
import { RiContactsBook2Fill } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import logo from '../assets/images/logo.png';

const Navbar = () => {

    const [nav, setNav] = useState(false);


    return (
        <div className='flex justify-between items-center h-40 max-w-[100rem] px-20 mx-auto pt-1' >

            {/* logo */}

            <img src={logo} alt="Logo firmy" className='h-16 w-48 -rotate-6' />

            {/* pages */}

            <div className='hidden lg:flex  mx-auto font-roboto text-xl '>
                <HeroLink text="Home" />
                <HeroLink text="Shop" />
                <HeroLink text="Custom" />
                <HeroLink text="Contact" />
            </div>

            <ToogleDarkButton />
            {/* right side navbar */}

            <div className='flex items-center '>

                {/* search input */}

                <div className='hidden sm:flex bg-white rounded-full items-center px-2 shadow-2xl hover:bg-gray-50 w-32 md:w-48 xl:w-64 '>
                    <AiOutlineSearch size={20} />
                    <input className='bg-transparent p-2 w-full focus:outline-none' type="text" placeholder='Szukaj' />
                </div>

                {/* favorite icon */}

                <RoundIcon icon={<AiOutlineHeart size={20} />} />

                {/* person icon */}

                <RoundIcon icon={<IoPersonOutline size={20} />} />

                {/* cart icon */}

                <RoundIcon icon={<BsCart2 size={20} />} />
            </div>


            {/* mobile phone*/}

            {/* menu icon */}

            <div onClick={() => setNav(!nav)} className='block lg:hidden cursor-pointer'>
                <AiOutlineMenu size={20} />
            </div>

            {/* overlay */}
            {nav ? <div className='bg-black/80 fixed w-full h-screen z-10 top-0 left-0'></div> : ''}

            {/* Side drawer menu */}

            <div className={nav ? 'fixed top-0 left-0 w-[19rem] h-screen bg-white z-10 duration-500' : 'fixed top-0 left-[-100%] w-[19rem] h-screen bg-white z-10 duration-500'}>
                <AiOutlineClose onClick={() => setNav(!nav)} size={25} className='absolute right-4 top-6 cursor-pointer' />

                <h2 className='text-2xl pl-4 pt-5 text-[#3ab4f2]'>Sneakers <span className='text-[#0078aa] font-bold'>Zone</span></h2>

                <div className='flex flex-col p-4 text-gray-800'>
                    <MobileLink text="Home" icon={<AiFillHome size={25} className='mr-4' />} />
                    <MobileLink text="Shop" icon={<AiTwotoneShop size={25} className='mr-4' />} />
                    <MobileLink text="Custom" icon={<FaPencilAlt size={25} className='mr-4' />} />
                    <a href='' className='text-xl py-4 flex border-b border-black hover:font-bold transform hover:scale-105 hover:ease-out duration-100'> <RiContactsBook2Fill size={25} className='mr-4' /> Contact</a>
                    <MobileLink text="Favorite" icon={<AiFillHeart size={25} className='mr-4' />} />
                    <MobileLink text="Cart" icon={<BsFillCartFill size={25} className='mr-4' />} />
                    <MobileLink text="Orders" icon={<BsBookFill size={25} className='mr-4' />} />
                    <MobileLink text="My Profile" icon={<BsFillPersonFill size={25} className='mr-4' />} />
                </div>

            </div>

        </div>
    )
}

export default Navbar;