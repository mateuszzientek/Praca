import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { BsArrowRightShort } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { FilterContext } from "../elements/FilterProvider";

interface BrandCardProps {
  brand: string;
  alt: string;
  text: string;
  brandName: string;
}

function BrandCard(props: BrandCardProps) {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const { setSelectedBrand } = useContext(FilterContext);

  const handleBrandClick = () => {
    setSelectedBrand(props.brandName);
    navigate(`/shop`);
  };

  return (
    <div
      className={`h-[23rem] w-60 pc:h-[28rem] pc:w-72 md:mx-5 xl:mx-10 pc:mx-14 bg-white dark:bg-[#d5d5d5] rounded-3xl ${theme === "dark" ? "shadow-card" : "shadow-button"
        } mb-8 transform hover:scale-110 hover:transition ease-out duration-300`}
    >
      <div className="h-[9rem] pc:h-[12rem] rounded-t-3xl shadow-xl  ">
        <LazyLoadImage
          src={props.brand}
          alt={props.alt}
          effect="blur"
          placeholderSrc={props.brand}
          className="rounded-t-3xl h-[9rem] w-60 pc:h-[12rem] pc:w-72"
        />
      </div>

      <div>
        <h2 className="text-sm pc:text-base font-roboto text-center mt-2 lg:mt-6 px-6">
          {props.text}
        </h2>
      </div>

      <div className="flex items-center justify-center mt-3 pc:mt-6 ">
        <button
          onClick={handleBrandClick}
          className="text-base pc:text-xl flex justify-center hover:border-b-2 border-black cursor-pointer"
        >
          See more
          <BsArrowRightShort size={30} className="pt-1 " />
        </button>
      </div>
    </div>
  );
}

export default BrandCard;
