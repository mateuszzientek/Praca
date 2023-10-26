import React, { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import zdjecie from "../../assets/images/profile_avatar.png";
import ToogleButton from "../elements/ToogleButton";
import RoundIcon from "../elements/RoundIcon";
import MobileLink from "../elements/MobileLink";
import HeroLink from "../elements/HeroLink";
import { LoginContext } from "../elements/LoginProvider";
import { ThemeContext } from "../elements/ThemeContext";
import ToogleDarkButton from "../elements/ToogleDarkButton";
import {
  AiOutlineSearch,
  AiOutlineHeart,
  AiOutlineClose,
  AiOutlineMenu,
  AiFillHome,
  AiTwotoneShop,
  AiFillHeart,
  AiFillCaretDown,
  AiFillCaretRight,
} from "react-icons/ai";
import { IoPersonOutline } from "react-icons/io5";
import {
  BsCart2,
  BsFillCartFill,
  BsBookFill,
  BsFillPersonFill,
  BsArrowLeft,
} from "react-icons/bs";
import { RiContactsBook2Fill } from "react-icons/ri";
import { GiWorld } from "react-icons/gi";
import { FaPencilAlt } from "react-icons/fa";
import logo from "../../assets/images/logo.png";
import logo2 from "../../assets/images/logo-black.png";
import languages from "../../languages";
import i18next from "i18next";
import ProfileLink from "../elements/ProfileLink";
import ProfileLinkMobile from "../elements/ProfileLinkMobile";
import axios from "axios";
import { AxiosRequestConfig } from "axios";
import { UserContext } from "../elements/UserProvider";
import storage from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FilterContext } from "../elements/FilterProvider";
import { CartContext } from "../elements/CartProvider";
import InfoDivBottom from "../elements/InfoDivBottom";

interface NavbarProps {
  background?: string;
  darkBackground?: string;
  shadow?: string;
  extra?: string;
  height?: string;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const {
    selectedBrand,
    setSelectedBrand,
    selectedCategory,
    setSelectedCategory,
    selectedPrice,
    setSelectedPrice,
    selectedMin,
    setSelectedMin,
    selectedMax,
    setSelectedMax,
    selectedSizes,
    setSelectedSizes,
    selectedSort,
    setSelectedSort,
    searchTerm,
    setSearchTerm,
  } = useContext(FilterContext);

  const lastVisitedPath = localStorage.getItem("lastVisitedPath");

  const { isLoginSelected, setLoginSelected } = useContext(LoginContext) || {};
  const { theme, setTheme } = useContext(ThemeContext);
  const { user, setUser, isUserLoggedIn, setIsUserLoggedIn } =
    useContext(UserContext);
  const [nav, setNav] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [isSecondDivVisible, setSecondDivVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const { quantityCart, setQuantityCart } = useContext(CartContext);
  const [errorsServer, setErrorsServer] = useState("");
  const [showSearchDiv, setShowSearchDiv] = useState(false);

  const currentCode = localStorage.getItem("i18nextLng");

  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.toLowerCase();
    localStorage.setItem("searchTerm", inputValue);
    setSelectedBrand("All");
    setSelectedCategory("");
    setSelectedPrice("");
    setSelectedMin("");
    setSelectedMax("");
    setSelectedSizes([]);
    setSelectedSort("");

    setSearchTerm(inputValue);
  };

  const handleImageLoad = async () => {
    if (user && user.avatar) {
      try {
        const pathReference = ref(storage, `/avatars/${user.avatar}`);
        const url = await getDownloadURL(pathReference);
        setImageUrl(url as any);
      } catch (error) {
        console.log("Błąd podczas pobierania zdjęcia:", error);
      }
    }
  };

  useEffect(() => {
    if (user) {
      handleImageLoad();
    }
  }, [user]);

  const handleClickRegister = () => {
    setLoginSelected(false);
    navigate("/login");
  };

  const handleClickLogin = () => {
    setLoginSelected(true);
    navigate("/login");
  };

  useEffect(() => {
    if (nav || showSearchDiv) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up the effect
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [nav, showSearchDiv]);

  const handleDivClick = () => {
    setSecondDivVisible(!isSecondDivVisible);
  };

  const handleClickLogout = () => {
    axios
      .post("/logout", {
        withCredentials: true,
      } as AxiosRequestConfig)
      .then((response) => {
        setUser(null);
        setIsUserLoggedIn(false);

        if (lastVisitedPath) {
          navigate(lastVisitedPath);
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Błąd podczas wylogowywania użytkownika:", error);
      });
  };

  const handleSearch = () => {
    localStorage.setItem("searchTerm", searchTerm);
    navigate(`/shop`);
  };

  return (
    <>
      <div className="flex justify-center">
        {errorsServer && (
          <InfoDivBottom color="bg-red-500" text={errorsServer} />
        )}
      </div>

      {showSearchDiv && (
        <div className="bg-white dark:bg-[#404040] fixed w-screen h-screen z-10 overflow-y-auto ">
          <div className="flex w-full space-x-4 mx-auto  mt-10 justify-center items-center">
            <div className="flex bg-black/5 dark:bg-white/50 rounded-full items-center px-2 w-[70%] h-[3rem]">
              <input
                className={`bg-transparent p-2 w-full focus:outline-none placeholder-black`}
                type="text"
                placeholder={t("navbar.search") as string}
                value={searchTerm}
                onChange={handleInputChange}
              />

              <button
                onClick={() => {
                  handleSearch();
                  setShowSearchDiv(!showSearchDiv);
                }}
                className="mr-2 "
              >
                <AiOutlineSearch size={20} />
              </button>
            </div>

            <div>
              <button onClick={() => setShowSearchDiv(!showSearchDiv)}>
                <p className="text-lg text-black dark:text-white hover:text-black/60">
                  {t("navbar.cancel")}
                </p>
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center mt-10 space-y-2 ">
            <p className="text-black/60  dark:text-white/60 text-lg">
              {t("navbar.text1")}
            </p>
            <p className="text-black  dark:text-white text-2xl ">Blazer</p>
            <p className="text-black dark:text-white text-2xl">Jordan</p>
            <p className="text-black dark:text-white text-2xl">Yeezy</p>
          </div>
        </div>
      )}

      <div
        className={`${props.background || "bg-[#F8F6F4]"} ${props.darkBackground || "dark:bg-[#292929]"
          } ${props.shadow || "shadow-2xl"} ${props.extra}`}
      >
        <div
          className={`flex justify-center md:justify-between items-center ${props.height || "h-32"
            }  md:max-w-[100rem] md:px-20 mx-auto pt-1 `}
        >
          {/* switcher -show mobile menu */}
          <div
            className=" md:hidden pl-8"
          >
            <AiOutlineMenu
              onClick={() => setNav(!nav)}
              size={25}
              color={theme === "dark" ? "white" : "black"}
              className="cursor-pointer  hover:scale-125 transition ease-in-out duration-300"
            />
          </div>

          {/* logo */}
          <div>
            <LazyLoadImage
              onClick={() => navigate("/")}
              src={theme === "dark" ? logo2 : logo}
              alt="Logo firmy"
              className="dark:h-20 h-16 w-48 -rotate-6 ml-20 mr-16 sm:ml-40 sm:mr-32 md:mx-0 cursor-pointer"
              effect="blur"
              placeholderSrc={theme === "dark" ? logo2 : logo}
            />
          </div>

          {/* pages */}
          <div className="hidden xl:flex  mx-auto font-roboto text-xl ">
            <HeroLink text={t("navbar.home")} link="/" />
            <HeroLink text={t("navbar.shop")} link="/shop" />
            <HeroLink text={t("navbar.custom")} link="/design" />
            <HeroLink text={t("navbar.contact")} link="/contact" />
          </div>

          {/* right side navbar */}

          <div className="flex items-center ">
            {/* dark mode switcher */}

            <ToogleDarkButton />

            {/* search input */}

            <div className="hidden md:flex bg-white rounded-full items-center px-2 shadow-2xl hover:bg-gray-50 w-32 md:w-48 xl:w-64 ">
              <input
                className="bg-transparent p-2 w-full focus:outline-none"
                type="text"
                placeholder={t("navbar.search") as string}
                value={searchTerm}
                onChange={handleInputChange}
              />
              <button onClick={handleSearch} className="mr-2">
                <AiOutlineSearch size={20} />
              </button>
            </div>

            {/* mobile icons */}

            <div className="flex  items-center space-x-3 sm:space-x-6 pr-8 md:pr-0 ">
              <AiOutlineSearch
                onClick={() => setShowSearchDiv(!showSearchDiv)}
                size={25}
                color={theme === "dark" ? "white" : "black"}
                className="cursor-pointer hover:scale-125 transition ease-in-out duration-300 md:hidden"
              />
              <div
                onClick={() => navigate("/cart")}
                className="relative hover:scale-125 ease-in-out duration-300"
              >
                {quantityCart !== 0 && (
                  <div className="flex lg:hidden justify-center items-center absolute -right-2 -top-2 w-[1rem] h-[1rem] rounded-full bg-red-500 z-3">
                    <p className="text-sm text-white">{quantityCart}</p>
                  </div>
                )}
                <BsCart2
                  size={25}
                  color={theme === "dark" ? "white" : "black"}
                  className="cursor-pointer hover:scale-110 transition ease-in-out duration-300 lg:hidden"
                />
              </div>
            </div>

            {/* favorite icon */}

            <div
              onClick={() => {
                navigate("/favorite");
              }}
            >
              <RoundIcon
                icon={<AiOutlineHeart size={20} />}
                extra="cursor-pointer hover:scale-125 ease-in-out duration-300"
              />
            </div>

            {/* person icon */}
            <div className="group relative">
              <RoundIcon
                icon={<IoPersonOutline size={20} />}
                extra="hover:scale-125 ease-in-out duration-300"
              />

              <div className="hidden group-hover:flex flex-col items-start space-y-4 absolute top-16 right-0 w-[18rem] p-4 h-auto bg-white dark:bg-[#e2e2e2] shadow-button mt-1 rounded z-10 animate-fade-in ">
                {!isUserLoggedIn && (
                  <button
                    onClick={handleClickLogin}
                    className="w-full h-[3rem] rounded bg-black/90 hover:scale-105 transition ease-in-out duration-300 hover:bg-black/70"
                  >
                    <p className="text-lg text-white px-4 whitespace-nowrap">
                      {t("profile.signin")}
                    </p>
                  </button>
                )}

                {!isUserLoggedIn && (
                  <p
                    onClick={handleClickRegister}
                    className="text-base whitespace-nowrap "
                  >
                    <span className="text-[#0078aa] cursor-pointer hover:border-b-2 border-[#0078aa]  ">
                      {t("profile.signup")}
                    </span>{" "}
                    {t("profile.continue")}
                  </p>
                )}

                {isUserLoggedIn && (
                  <div className="flex items-center space-x-2 ml-2">
                    <p className="text-lg whitespace-nowrap">
                      {t("profile.hello")} {user?.name}
                    </p>
                    <img
                      src={imageUrl ? imageUrl : zdjecie}
                      className="rounded-full w-[2rem] h-[2rem]"
                    />
                  </div>
                )}

                <div className="border-b border-black/50 w-full"></div>

                {user?.role === "admin" && <ProfileLink text="Admin Panel" link="/adminPanel" />}
                <ProfileLink text={t("profile.myprofile")} link="/profile" />
                <ProfileLink text={t("profile.address")} link="/address" />
                <ProfileLink text={t("profile.orders")} link="/order" />
                <ProfileLink text={t("profile.projects")} link="/myProjects" />
                <ProfileLink text={t("profile.help")} link="/contact" />

                {isUserLoggedIn && (
                  <button
                    onClick={handleClickLogout}
                    className="w-full h-[3rem] rounded bg-black/90 hover:scale-105 transition ease-in-out duration-300 hover:bg-black/70"
                  >
                    <p className="text-lg text-white px-4 whitespace-nowrap">
                      {t("profile.signout")}
                    </p>
                  </button>
                )}
              </div>
            </div>

            {/* cart icon */}

            <div
              onClick={() => navigate("/cart")}
              className="relative hover:scale-125 ease-in-out duration-300"
            >
              {quantityCart !== 0 && (
                <div className="hidden lg:flex justify-center items-center absolute -right-1 top-2 w-[1.2rem] h-[1.2rem] rounded-full bg-red-500 z-3">
                  <p className="text-sm text-white">{quantityCart}</p>
                </div>
              )}

              <RoundIcon icon={<BsCart2 size={20} />} extra="cursor-pointer" />
            </div>

            {/* button for language */}
            <div
              onClick={() => setDropdown(!dropdown)}
              className="relative hidden lg:flex justify-center items-center rounded-full mx-4 sm:mr-0"
            >
              <div className="hover:scale-110 ease-in-out duration-300 cursor-pointer ">
                <GiWorld
                  color={theme === "dark" ? "white" : "black"}
                  size={35}
                  className="opacity-80"
                />
                <AiFillCaretDown
                  color={theme === "dark" ? "white" : "black"}
                  className="absolute left-8 top-0 opacity-80 "
                  size={20}
                />
              </div>
              {dropdown ? (
                <div className="absolute top-12 right-0 min-w-full w-max  bg-white shadow-button mt-1 rounded z-10 ">
                  <div className="flex flex-col">
                    {languages.map(({ code, name, country_code }) => (
                      <button
                        key={country_code}
                        onClick={() => (i18next as any).changeLanguage(code)}
                        disabled={code === currentCode}
                        className="flex justify-start items-center pr-6 pl-3 py-[0.5rem]  hover:bg-black/10"
                      >
                        <span className={`fi fi-${country_code} mr-2`}></span>
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>

            {/* switcher -show mobile menu */}
            <div
              onClick={() => setNav(!nav)}
              className="hidden md:block xl:hidden cursor-pointer ml-4 sm:ml-8"
            >
              <AiOutlineMenu
                size={25}
                color={theme === "dark" ? "white" : "black"}
              />
            </div>
          </div>

          {/* mobile phone*/}

          {/* overlay */}
          {nav ? (
            <div className="bg-black/80 fixed w-full h-screen z-10 top-0 left-0"></div>
          ) : (
            ""
          )}

          {/* Side drawer menu */}

          <div
            className={
              nav
                ? "fixed top-0 left-0 w-[19rem] h-screen overflow-y-auto   bg-white dark:bg-black z-10 duration-500"
                : "fixed top-0 left-[-100%] w-[19rem] h-screen bg-white z-10 duration-500 "
            }
          >
            <AiOutlineClose
              onClick={() => setNav(!nav)}
              size={25}
              color={theme === "dark" ? "white" : "black"}
              className="absolute right-4 top-6 cursor-pointer"
            />

            <h2 className="text-2xl pl-4 pt-5 text-[#3ab4f2]">
              Sneakers <span className="text-[#0078aa] font-bold">Zone</span>
            </h2>

            <div className="flex flex-col py-4 text-gray-800">
              <MobileLink
                text={t("navbar.home")}
                icon={<AiFillHome size={25} className="mr-4" />}
                link="/"
              />
              <MobileLink
                text={t("navbar.shop")}
                icon={<AiTwotoneShop size={25} className="mr-4" />}
                link="/shop"
              />
              <MobileLink
                text={t("navbar.custom")}
                icon={<FaPencilAlt size={25} className="mr-4" />}
                link="/design"
              />
              <MobileLink
                text={t("navbar.contact")}
                icon={<RiContactsBook2Fill size={25} className="mr-4" />}
                link="/contact"
              />
              <div className="border-b border-black dark:border-white"></div>
              <div onClick={handleDivClick} className="cursor-pointer">
                <MobileLink
                  text={t("navbar.profile")}
                  icon={<BsFillPersonFill size={25} className="mr-4" />}
                />
              </div>
              <MobileLink
                text={t("navbar.favorite")}
                icon={<AiFillHeart size={25} className="mr-4" />}
                link="/favorite"
              />
              <MobileLink
                text={t("navbar.cart")}
                icon={<BsFillCartFill size={25} className="mr-4" />}
                link="/cart"
              />

              <div className="flex items-center my-2">
                <p className="text-xl text-black dark:text-white px-4 ">
                  {t("darkmode")}
                </p>
                <ToogleButton />
              </div>

              <div className="flex items-center my-2">
                <p
                  onClick={() => setDropdown(!dropdown)}
                  className="cursor-pointer flex items-center text-xl text-black dark:text-white px-4 "
                >
                  {t("language")}
                  <AiFillCaretRight
                    color={theme === "dark" ? "white" : "black"}
                    size={25}
                  />
                </p>
                {dropdown
                  ? languages.map(({ code, name, country_code }) => {
                    if (code !== (i18next as any).language) {
                      return (
                        <button
                          key={country_code}
                          onClick={() => {
                            (i18next as any).changeLanguage(code);
                            setDropdown(!dropdown);
                          }}
                        >
                          <span
                            className={`fi fi-${country_code} mr-2 text-xl hover:scale-125 ease-in-out duration-300`}
                          />
                        </button>
                      );
                    }
                    return null;
                  })
                  : ""}
              </div>

              {isUserLoggedIn && (
                <button
                  onClick={handleClickLogout}
                  className="h-[3rem] w-[50%] mx-auto bg-black/70 dark:bg-white/50 rounded-full mt-6 hover:scale-110 ease-in-out duration-300"
                >
                  <p className="text-white text-lg">{t("profile.signout")}</p>
                </button>
              )}

              {!isUserLoggedIn && (
                <button
                  onClick={handleClickLogin}
                  className="h-[3rem] w-[50%] mx-auto bg-black/70 dark:bg-white rounded-full mt-6 hover:scale-110 ease-in-out duration-300"
                >
                  <p className="text-white dark:text-black/80 text-lg">
                    {t("login.signin")}
                  </p>
                </button>
              )}

              {!isUserLoggedIn && (
                <button
                  onClick={handleClickRegister}
                  className="h-[3rem] w-[50%] mx-auto border-2 border-black/60 dark:border-white rounded-full mt-6 hover:scale-110 ease-in-out duration-300"
                >
                  <p className="text-black dark:text-white text-lg">
                    {t("login.signup")}
                  </p>
                </button>
              )}

              {isSecondDivVisible && (
                <div
                  className={`fixed top-0 left-0 w-[19rem] h-screen bg-white dark:bg-black z-20 slide-in overflow-y-auto`}
                >
                  <div
                    onClick={handleDivClick}
                    className="flex items-center absolute left-4 top-6 cursor-pointer space-x-2 hover:scale-105 transition ease-in-out duration-300"
                  >
                    <BsArrowLeft
                      size={25}
                      color={theme === "dark" ? "white" : "black"}
                    />
                    <p className="text-lg text-black dark:text-white">
                      {t("navbar.back")}
                    </p>
                  </div>

                  <div className="flex flex-col items-start mt-20  ">
                    {isUserLoggedIn && (
                      <div className="flex items-center space-x-2 mb-2 ml-4 ">
                        <p className="text-2xl whitespace-nowrap text-[#0078aa]">
                          {t("profile.hello")} {user?.name}
                        </p>
                        <img
                          src={imageUrl ? imageUrl : zdjecie}
                          className="rounded-full w-[2rem] h-[2rem]"
                        />
                      </div>
                    )}

                    <div className="flex flex-col text-2xl mt-4 w-full">
                      {user?.role === "admin" &&
                        <ProfileLinkMobile
                          text="Admin Panel"
                          link="/adminPanel"
                        />}
                      <ProfileLinkMobile
                        text={t("profile.myprofile")}
                        link="/profile"
                      />
                      <ProfileLinkMobile
                        text={t("profile.address")}
                        link="/address"
                      />
                      <ProfileLinkMobile
                        text={t("profile.orders")}
                        link="/order"
                      />
                      <ProfileLinkMobile
                        text={t("profile.projects")}
                        link="/myProjects"
                      />
                      <ProfileLinkMobile
                        text={t("profile.help")}
                        link="/contact"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
