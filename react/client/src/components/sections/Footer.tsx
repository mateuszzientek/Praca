import React from "react";
import { useTranslation } from "react-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { BsFacebook, BsInstagram } from "react-icons/bs";
import { AiFillTwitterCircle } from "react-icons/ai";
import logo from "../../assets/images/logo2.png";

function Footer() {
  let iconStyles = { color: "white" };
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex justify-center  bg-black/90 md:h-28 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:w-[90%] lg:w-[80%] 2xl:w-[90rem] space-y-3  ">
          {/* social media  */}
          <div className="flex items-center space-x-4 ">
            <BsFacebook
              className="cursor-pointer hover:scale-125 transition ease-out duration-300"
              style={iconStyles}
              size={35}
            />
            <AiFillTwitterCircle
              className="cursor-pointer hover:scale-125 transition ease-out duration-300"
              style={iconStyles}
              size={40}
            />
            <BsInstagram
              className="cursor-pointer hover:scale-125 transition ease-out duration-300"
              style={iconStyles}
              size={35}
            />
          </div>

          {/* logo */}
          <div className="flex items-center space-x-2">
            <LazyLoadImage
              alt="Logo SneakerZone"
              effect="blur"
              placeholderSrc={logo}
              src={logo}
              className="h-[4rem] w-[10rem] lg:h-[5rem] lg:w-[13rem]"
            />
          </div>

          {/* return/ delivery */}
          <div className="flex text-xl pc:text-2xl space-x-4 text-white ">
            <div className="cursor-pointer group transition duration-300 ">
              <a>{t("footer.delivery")}</a>
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
            </div>
            <div className="cursor-pointer group transition duration-300">
              <a> {t("footer.return")}</a>
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
            </div>
          </div>
        </div>
      </div>

      {/* all rights reserved */}
      <div className="flex justify-center items-center bg-black/95 h-[3rem] ">
        <p className="text-white/80 lg:text-xl">
          © SneakersZone. {t("footer.rights")}{" "}
        </p>
      </div>
    </div>
  );
}

export default Footer;
