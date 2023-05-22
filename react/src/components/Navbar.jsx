import React, { useState, useContext } from 'react';
import { useTranslation } from "react-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import RoundIcon from "./RoundIcon";
import MobileLink from "./MobileLink";
import HeroLink from "./HeroLink";
import { ThemeContext } from './ThemeContext';
import ToogleDarkButton from './ToogleDarkButton';
import { AiOutlineSearch, AiOutlineHeart, AiOutlineClose, AiOutlineMenu, AiFillHome, AiTwotoneShop, AiFillHeart, AiFillCaretDown } from 'react-icons/ai';
import { IoPersonOutline } from 'react-icons/io5';
import { BsCart2, BsFillCartFill, BsBookFill, BsFillPersonFill } from "react-icons/bs";
import { RiContactsBook2Fill } from "react-icons/ri";
import { GiWorld } from "react-icons/gi";
import { FaPencilAlt } from "react-icons/fa";
import logo from '../assets/images/logo.png';
import logo2 from '../assets/images/logo-black.png';
import languages from '../languages';
import i18next from 'i18next';

const Navbar = () => {

    const { theme, setTheme } = useContext(ThemeContext);
    const [nav, setNav] = useState(false);
    const [dropdown, setDropdown] = useState(false);

    const currentCode = localStorage.getItem('i18nextLng')

    const { t } = useTranslation()


    return (
        <div className='flex justify-between items-center h-40 max-w-[100rem] px-10  md:px-20 mx-auto pt-1' >

            {/* logo */}

            <LazyLoadImage
                src={theme === 'dark' ? logo2 : logo}
                alt="Logo firmy"
                className='dark:h-20 h-16 w-48 -rotate-6'
                effect="blur"
                placeholderSrc={theme === 'dark' ? logo2 : logo} />

            {/* pages */}

            <div className='hidden xl:flex  mx-auto font-roboto text-xl '>
                <HeroLink text={t('navbar.home')} />
                <HeroLink text={t('navbar.shop')} />
                <HeroLink text={t('navbar.custom')} />
                <HeroLink text={t('navbar.contact')} />
            </div>

            {/* right side navbar */}

            <div className='flex items-center '>

                {/* dark mode switcher */}

                <ToogleDarkButton />

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

                {/* button for language */}
                <div onClick={() => setDropdown(!dropdown)} className='relative flex justify-center items-center rounded-full ml-4 mr-4 sm:mr-0'>
                    <div className='hover:scale-110 ease-in-out duration-300 cursor-pointer '>
                        <GiWorld color={theme === 'dark' ? "white" : "black"} size={35} className='opacity-80' />
                        <AiFillCaretDown color={theme === 'dark' ? "white" : "black"} className="absolute left-8 top-0 opacity-80 " size={20} />
                    </div>
                    {dropdown ? <div className='absolute top-12 right-0 min-w-full w-max  bg-white shadow-button mt-1 rounded z-10 '>
                        <div className='flex flex-col  '>
                            {languages.map(({ code, name, country_code }) => (
                                <button
                                    key={country_code}
                                    onClick={() => i18next.changeLanguage(code)}
                                    disabled={code === currentCode}
                                    className='flex justify-start items-center pr-6 pl-3 py-[0.5rem]  hover:bg-black/10'>

                                    <span className={`fi fi-${country_code} mr-2`} ></span>
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div> : ""}
                </div>


                {/* switcher -show mobile menu */}
                <div onClick={() => setNav(!nav)} className='block xl:hidden cursor-pointer ml-4 sm:ml-8'>
                    <AiOutlineMenu size={25} color={theme === 'dark' ? "white" : "black"} />
                </div>

            </div >


            {/* mobile phone*/}

            {/* overlay */}
            {nav ? <div className='bg-black/80 fixed w-full h-screen z-10 top-0 left-0'></div> : ''}

            {/* Side drawer menu */}

            <div className={nav ? 'fixed top-0 left-0 w-[19rem] h-screen bg-white dark:bg-black z-10 duration-500' : 'fixed top-0 left-[-100%] w-[19rem] h-screen bg-white z-10 duration-500'}>
                <AiOutlineClose onClick={() => setNav(!nav)} size={25} color={theme === 'dark' ? "white" : "black"} className='absolute right-4 top-6 cursor-pointer' />

                <h2 className='text-2xl pl-4 pt-5 text-[#3ab4f2]'>Sneakers <span className='text-[#0078aa] font-bold'>Zone</span></h2>

                <div className='flex flex-col p-4 text-gray-800'>
                    <MobileLink text={t('navbar.home')} icon={<AiFillHome size={25} className='mr-4' />} />
                    <MobileLink text={t('navbar.shop')} icon={<AiTwotoneShop size={25} className='mr-4' />} />
                    <MobileLink text={t('navbar.custom')} icon={<FaPencilAlt size={25} className='mr-4' />} />
                    <a href='' className='text-xl py-4 flex border-b border-black dark:border-white hover:font-bold transform hover:scale-105 hover:ease-out duration-100 text-black dark:text-white'> <RiContactsBook2Fill size={25} className='mr-4' /> {t('navbar.contact')}</a>
                    <MobileLink text={t('navbar.favorite')} icon={<AiFillHeart size={25} className='mr-4' />} />
                    <MobileLink text={t('navbar.cart')} icon={<BsFillCartFill size={25} className='mr-4' />} />
                    <MobileLink text={t('navbar.orders')} icon={<BsBookFill size={25} className='mr-4' />} />
                    <MobileLink text={t('navbar.profile')} icon={<BsFillPersonFill size={25} className='mr-4' />} />
                </div>

            </div>

        </div >
    )
}

export default Navbar;