import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import zdjecie from "../../assets/images/404.png";
import { BsArrowRightShort } from "react-icons/bs";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function PageNotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="bg-[#ECF8F9] dark:bg-[#4f4f4f]  flex flex-col  justify-start items-center pb-16 min-h-screen">
      <LazyLoadImage
        alt="404 Page not found"
        className="w-[22rem] h-[20rem] xl:w-[30rem] xl:h-[20rem] lg:w-[36rem] lg:h-[25rem] "
        src={zdjecie}
        effect="blur"
        placeholderSrc={zdjecie}
      />

      <div className="text-center font-lato text-black/80 dark:text-white/80 ">
        <p className="mt-16 font-bold text-3xl md:text-4xl  pc:text-7xl ">
          {t("pagenotfound.main")}
        </p>
        <p className="mt-8 text-lg pc:text-2xl w-[80%] mx-auto md:w-[auto]">
          {t("pagenotfound.text")}
        </p>
      </div>

      <button
        onClick={() => navigate("/")}
        type="button"
        className="flex items-center text-xl lg:text-2xl rounded-full bg-[#97DEFF] shadow-button w-auto px-4 h-[3rem] mt-10 transform hover:scale-110 transition ease-out duration-300 "
      >
        <p className="text-black/80">{t("pagenotfound.button")}</p>
        <BsArrowRightShort size={25} />
      </button>
    </div>
  );
}

export default PageNotFound;
