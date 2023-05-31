import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import ToogleButton from '../elements/ToogleButton';
import RoundIcon from "../elements/RoundIcon";
import MobileLink from "../elements/MobileLink";
import HeroLink from "../elements/HeroLink";
import { ThemeContext } from '../elements/ThemeContext';
import ToogleDarkButton from '../elements/ToogleDarkButton';
import { AiOutlineSearch, AiOutlineHeart, AiOutlineClose, AiOutlineMenu, AiFillHome, AiTwotoneShop, AiFillHeart, AiFillCaretDown, AiFillCaretRight } from 'react-icons/ai';
import { IoPersonOutline } from 'react-icons/io5';
import { BsCart2, BsFillCartFill, BsBookFill, BsFillPersonFill } from "react-icons/bs";
import { RiContactsBook2Fill } from "react-icons/ri";
import { GiWorld } from "react-icons/gi";
import { FaPencilAlt } from "react-icons/fa";
import logo from '../../assets/images/logo.png';
import logo2 from '../../assets/images/logo-black.png';
import languages from '../../languages';
import i18next from 'i18next';

interface NavbarProps {
    background?: string;
    darkBackground?: string;
    shadow?: string;
    extra?: string;
    height?: string;
  }
  
  const Navbar: React.FC<NavbarProps> = (props) => {

    const { theme, setTheme } = useContext(ThemeContext);
    const [nav, setNav] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [dropdownMobile, setDropdownMobile] = useState(false);

    const currentCode = localStorage.getItem('i18nextLng')

    const { t } = useTranslation()

    useEffect(() => {
        if (nav) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [nav]);


    return (
        <div className={`${props.background || 'bg-[#F8F6F4]'} ${props.darkBackground || 'dark:bg-[#292929]'} ${props.shadow || 'shadow-2xl'} ${props.extra}`} >

            <div className={`flex justify-center md:justify-between items-center ${props.height || 'h-32'}  md:max-w-[100rem] md:px-20 mx-auto pt-1 `}>

                {/* switcher -show mobile menu */}
                <div onClick={() => setNav(!nav)} className=' md:hidden cursor-pointer pl-8 hover:scale-125 transition ease-in-out duration-300'>
                    <AiOutlineMenu size={25} color={theme === 'dark' ? "white" : "black"} />
                </div>

                {/* logo */}
                <div>
                    <LazyLoadImage
                        src={theme === 'dark' ? logo2 : logo}
                        alt="Logo firmy"
                        className='dark:h-20 h-16 w-48 -rotate-6 ml-20 mr-16 sm:ml-40 sm:mr-32 md:mx-0 '
                        effect="blur"
                        placeholderSrc={theme === 'dark' ? logo2 : logo} />
                </div>


                {/* pages */}
                <div className='hidden xl:flex  mx-auto font-roboto text-xl '>
                    <HeroLink text={t('navbar.home')} link="/" />
                    <HeroLink text={t('navbar.shop')} link="/abra" />
                    <HeroLink text={t('navbar.custom')} link="/cfd" />
                    <HeroLink text={t('navbar.contact')} link="/contact" />
                </div>

                {/* right side navbar */}

                <div className='flex items-center '>

                    {/* dark mode switcher */}

                    <ToogleDarkButton />

                    {/* search input */}

                    <div className='hidden md:flex bg-white rounded-full items-center px-2 shadow-2xl hover:bg-gray-50 w-32 md:w-48 xl:w-64 '>
                        <AiOutlineSearch size={20} />
                        <input className='bg-transparent p-2 w-full focus:outline-none' type="text" placeholder='Szukaj' />
                    </div>

                    {/* mobile icons */}

                    <div className='flex  items-center space-x-3 sm:space-x-6 pr-8 md:pr-0 '>
                        <AiOutlineSearch size={25} color={theme === 'dark' ? "white" : "black"} className='cursor-pointer hover:scale-125 transition ease-in-out duration-300 md:hidden' />
                        <BsCart2 size={25} color={theme === 'dark' ? "white" : "black"} className='cursor-pointer hover:scale-125 transition ease-in-out duration-300 lg:hidden' />
                    </div>

                    {/* favorite icon */}

                    <RoundIcon icon={<AiOutlineHeart size={20} />} />

                    {/* person icon */}

                    <RoundIcon icon={<IoPersonOutline size={20} />} />

                    {/* cart icon */}

                    <RoundIcon icon={<BsCart2 size={20} />} />

                    {/* button for language */}
                    <div onClick={() => setDropdown(!dropdown)} className='relative hidden lg:flex justify-center items-center rounded-full ml-4 mr-4 sm:mr-0'>
                        <div className='hover:scale-110 ease-in-out duration-300 cursor-pointer '>
                            <GiWorld color={theme === 'dark' ? "white" : "black"} size={35} className='opacity-80' />
                            <AiFillCaretDown color={theme === 'dark' ? "white" : "black"} className="absolute left-8 top-0 opacity-80 " size={20} />
                        </div>
                        {dropdown ? <div className='absolute top-12 right-0 min-w-full w-max  bg-white shadow-button mt-1 rounded z-10 '>
                            <div className='flex flex-col'>
                                {languages.map(({ code, name, country_code }) => (
                                    <button
                                        key={country_code}
                                        onClick={() => (i18next as any).changeLanguage(code)}
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
                    <div onClick={() => setNav(!nav)} className='hidden md:block xl:hidden cursor-pointer ml-4 sm:ml-8'>
                        <AiOutlineMenu size={25} color={theme === 'dark' ? "white" : "black"} />
                    </div>

                </div >



                {/* mobile phone*/}

                {/* overlay */}
                {nav ? <div className='bg-black/80 fixed w-full h-screen z-10 top-0 left-0'></div> : ''}

                {/* Side drawer menu */}

                <div className={nav ? 'fixed top-0 left-0 w-[19rem] h-screen overflow-y-auto  bg-white dark:bg-black z-10 duration-500' : 'fixed top-0 left-[-100%] w-[19rem] h-screen bg-white z-10 duration-500'}>
                    <AiOutlineClose onClick={() => setNav(!nav)} size={25} color={theme === 'dark' ? "white" : "black"} className='absolute right-4 top-6 cursor-pointer' />

                    <h2 className='text-2xl pl-4 pt-5 text-[#3ab4f2]'>Sneakers <span className='text-[#0078aa] font-bold'>Zone</span></h2>

                    <div className='flex flex-col py-4 text-gray-800'>
                        <MobileLink text={t('navbar.home')} icon={<AiFillHome size={25} className='mr-4' />} link="/" />
                        <MobileLink text={t('navbar.shop')} icon={<AiTwotoneShop size={25} className='mr-4' />} link="/fds" />
                        <MobileLink text={t('navbar.custom')} icon={<FaPencilAlt size={25} className='mr-4' />} link="/fds" />
                        <MobileLink text={t('navbar.contact')} icon={<RiContactsBook2Fill size={25} className='mr-4' />} link="/contact" />
                        <div className="border-b border-black dark:border-white"></div>
                        <MobileLink text={t('navbar.favorite')} icon={<AiFillHeart size={25} className='mr-4' />} link="/fds" />
                        <MobileLink text={t('navbar.cart')} icon={<BsFillCartFill size={25} className='mr-4' />} link="/fds" />
                        <MobileLink text={t('navbar.orders')} icon={<BsBookFill size={25} className='mr-4' />} link="/fds" />
                        <MobileLink text={t('navbar.profile')} icon={<BsFillPersonFill size={25} className='mr-4' />} link="/fds" />

                        <div className='flex items-center my-2'>
                            <p className='text-xl text-black dark:text-white px-4 '>{t('darkmode')}</p>
                            <ToogleButton />
                        </div>

                        <div className='flex items-center my-2'>
                            <p onClick={() => setDropdown(!dropdown)} className='cursor-pointer flex items-center text-xl text-black dark:text-white px-4 '>{t('language')}
                                <AiFillCaretRight color={theme === 'dark' ? "white" : "black"} size={25} /></p>
                            {dropdown ? (
                                languages.map(({ code, name, country_code }) => {
                                    if (code !== (i18next as any).language) {
                                        return (
                                            <button
                                                key={country_code}
                                                onClick={() => {
                                                    (i18next as any).changeLanguage(code)
                                                    setDropdown(!dropdown)
                                                }}
                                            >
                                                <span className={`fi fi-${country_code} mr-2 text-xl hover:scale-125 ease-in-out duration-300`} />
                                            </button>
                                        );
                                    }
                                    return null;
                                })
                            ) : ""}
                        </div>

                    </div>

                </div>
            </div>

        </div >
    )
}

export default Navbar;