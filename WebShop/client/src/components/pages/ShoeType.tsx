import React from "react";
import Navbar from "../sections/Navbar";
import airForce from "../../assets/images/airfoce.png";
import dunk from "../../assets/images/dunk.png";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function ShoeType() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5EFE7] dark:bg-[#5c5c5c] pb-20">
      <Navbar background="bg-white" shadow="shadow-lg" />

      <p className="mt-20 text-center text-4xl text-black/80  dark:text-white/80 ">
        {t("design.text9")}
      </p>

      <div className="flex justify-center items-center flex-col lg:flex-row lg:mt-20 mt-14 space-y-10  lg:space-y-0 lg:space-x-10 ">
        <div
          onClick={() => navigate("/customization/low")}
          className="flex items-center justify-center w-[25rem] h-[15rem] xl:w-[35rem] xl:h-[25rem] bg-white dark:bg-[#212121] shadow-2xl rounded-2xl hover:scale-105 ease-in-out duration-500 cursor-pointer"
        >
          <LazyLoadImage
            src={airForce}
            alt="Photo of shoe"
            effect="blur"
            className="xl:h-[15rem] h-[10rem]"
            placeholderSrc={airForce}
          />
        </div>
        <div
          onClick={() => navigate("/customization/high")}
          className="flex items-center justify-center w-[25rem] h-[15rem] xl:w-[35rem] xl:h-[25rem] bg-white dark:bg-[#212121] shadow-2xl rounded-2xl hover:scale-105 ease-in-out duration-500 cursor-pointer"
        >
          <LazyLoadImage
            src={dunk}
            alt="Photo of shoe"
            effect="blur"
            className="xl:h-[18rem] h-[12rem]"
            placeholderSrc={dunk}
          />
        </div>
      </div>
    </div>
  );
}

export default ShoeType;
