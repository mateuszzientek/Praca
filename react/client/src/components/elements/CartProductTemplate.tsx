import React, { useState, useContext, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useNavigate } from "react-router-dom";
import { AiOutlineDown } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import axios from "axios";
import { UserContext } from "../elements/UserProvider";
import { FilterContext } from "../elements/FilterProvider";
import { ThemeContext } from "../elements/ThemeContext";
import InfoDivBottom from "../elements/InfoDivBottom";
import { useTranslation } from "react-i18next";
import { formatPrice } from "src/resources/currencyUtils";
import { SizesInterface } from "src/types";

interface CartProductTemplateProps {
  _id: string;
  idShoe: string;
  imageUrl: string;
  name: string;
  brand: string;
  cartSize: string;
  price: number;
  discountPrice: number;
  sizes: SizesInterface[];
  cartQuantity: number;
  updateQuantityInShoes: (
    shoeId: string,
    size: string,
    newQuantity: number
  ) => void;
  onDelete: (cartId: string) => void;
}

function CartProductTemplate(props: CartProductTemplateProps) {
  const { setSelectedBrand } = useContext(FilterContext);
  const currentCode = localStorage.getItem("i18nextLng");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);

  //////////Variables/////////////

  const [showMessageDelete, setShowMessageDelete] = useState(false);
  const [showQuantity, setShowQuantity] = useState(false);
  const [error, setError] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(props.cartQuantity);

  const shoePrice = selectedQuantity
    ? selectedQuantity * props.price
    : props.cartQuantity * props.price;
  const shoeDiscountPrice = selectedQuantity
    ? selectedQuantity * props.discountPrice
    : props.cartQuantity * props.discountPrice;

  /////////Functions//////////

  const handleShoeClick = () => {
    navigate(`/shoeView/${props.idShoe}`);
  };

  const handleBrandClick = () => {
    setSelectedBrand(props.brand);
    navigate(`/shop`);
  };

  const handleSizeClick = (quantity: number) => {
    setSelectedQuantity(quantity);
    setShowQuantity(false);
    props.updateQuantityInShoes(props.idShoe, props.cartSize, quantity);
  };

  const handleDeleteClick = () => {
    const data = {
      cartId: props._id,
      userId: user ? user._id : "",
    };

    axios
      .post("/deleteCart", data)
      .then((response) => {
        setShowMessageDelete(true);

        setTimeout(() => {
          props.onDelete(props._id);
          setShowMessageDelete(false);
        }, 1000);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setError(error.response.data.error);
        } else {
          console.log(error);
        }
      });
  };

  /////////UseEffects///////////

  useEffect(() => {
    const requestData = {
      shoeId: props.idShoe,
      size: props.cartSize,
      quantity: selectedQuantity,
      userId: "",
    };

    if (user?._id) {
      requestData.userId = user._id;
    }

    axios
      .post("/updateQuantityCart", requestData)
      .then((response) => { })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setError(error.response.data.error);
        } else {
          console.log(error);
        }
      });
  }, [selectedQuantity]);

  return (
    <>
      <div className="flex justify-center">
        {error && <InfoDivBottom color="bg-red-500" text={error} />}
      </div>

      <div className="w-[90%] xl:w-[50rem] 2xl:w-[55rem] mx-auto">
        {showMessageDelete ? (
          <div className="flex items-center justify-center py-14 border-b-[1px] border-black/50 dark:border-white/50 animate-opacity">
            <p className="text-xl text-black dark:text-white">
              {t("cart.text13")}
            </p>
          </div>
        ) : (
          <div className=" relative flex items-center py-8 border-b-[1px] border-black/50 dark:border-white/50">
            <div onClick={handleShoeClick}>
              <LazyLoadImage
                src={props.imageUrl}
                alt="Photo of shoes"
                effect="blur"
                placeholderSrc={props.imageUrl}
                className=" w-[7rem] md:w-[9rem] -rotate-17 cursor-pointer"
              />
            </div>
            <div className="ml-10">
              <p
                onClick={handleBrandClick}
                className="text-lg text-black dark:text-white cursor-pointer hover:border-b-[1px] border-black/50 dark:border-white/50"
              >
                {props.brand}
              </p>
              <p
                onClick={handleShoeClick}
                className="text-lg mt-2 text-black/80 dark:text-white/80 cursor-pointer hover:border-b-[1px] border-black/50 dark:border-white/50"
              >
                {props.name}
              </p>
              <p className="text-lg text-black/80 dark:text-white/80 md:hidden">
                {t("shop.size")} {props.cartSize}
              </p>

              <div className={`flex md:hidden space-x-2`}>
                <p
                  className={`text-lg ' ${props.discountPrice !== 0
                    ? "text-red-500"
                    : "text-black dark:text-white"
                    } `}
                >
                  {formatPrice(shoePrice, t)}
                </p>
                {props.discountPrice !== 0 && (
                  <p className="text-lg text-black/50 dark:text-white/50 line-through ">
                    {formatPrice(shoeDiscountPrice, t)}
                  </p>
                )}
              </div>

              <div className="flex mt-4 items-center ">
                <BsTrash
                  className="cursor-pointer"
                  size={20}
                  color={theme === "dark" ? "white" : "black"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick();
                  }}
                />
                <p
                  className="text-lg text-black/80 dark:text-white/80 cursor-pointer pl-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick();
                  }}
                >
                  {t("cart.delete")}
                </p>
              </div>
            </div>

            <div className="absolute bottom-10 md:bottom-auto right-4  md:right-[8.5rem] lg:right-[11.7rem] ">
              <button
                onClick={() => setShowQuantity(!showQuantity)}
                className="flex items-center justify-center px-3 py-2  border-2 border-black/50 dark:border-white/50 space-x-4 "
              >
                <p className="text-lg text-black dark:text-white">
                  {selectedQuantity ? selectedQuantity : props.cartQuantity}
                </p>
                <AiOutlineDown color={theme === "dark" ? "white" : "black"} />
              </button>

              {showQuantity && (
                <div>
                  {props.sizes.map((sizeObj) => {
                    const size = sizeObj.size;
                    const quantity = sizeObj.quantity;

                    if (size === props.cartSize) {
                      const maxQuantityToShow = Math.min(quantity, 10); // Pokaż maksymalnie 10 liczb

                      return (
                        <button
                          key={size}
                          className="flex flex-col items-center  bg-[#e3e3e3] rounded-md absolute top-14 w-[4.5rem] z-10 cursor-auto"
                        >
                          {Array.from(
                            { length: maxQuantityToShow },
                            (_, index) => index + 1
                          ).map((num) => (
                            <div
                              onClick={() => handleSizeClick(num)}
                              key={num}
                              className=" text-black  text-lg  w-full hover:bg-[#bababa]"
                            >
                              {num}
                            </div>
                          ))}
                        </button>
                      );
                    }

                    return null; // Nie renderuj przycisków dla innych rozmiarów
                  })}
                </div>
              )}
            </div>

            <p className="absolute hidden md:block right-[16rem]  lg:right-[22.5rem] text-lg text-black dark:text-white">
              {props.cartSize}
            </p>

            <div
              className={`flex-col hidden md:flex absolute ${currentCode === "pl" ? "right-[2.4rem]" : "right-[2rem]"
                }  space-y-1`}
            >
              <p
                className={`text-lg ' ${props.discountPrice !== 0
                  ? "text-red-500"
                  : "text-black dark:text-white"
                  } `}
              >
                {formatPrice(shoePrice, t)}
              </p>
              {props.discountPrice !== 0 && (
                <p className="text-lg text-black/50 dark:text-white/50 line-through ">
                  {formatPrice(shoeDiscountPrice, t)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CartProductTemplate;
