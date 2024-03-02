import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { formatPrice } from "src/resources/currencyUtils";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ShoeInterface } from "src/types";

interface Shoe extends ShoeInterface {
  brand: string;
  _idProduct?: string;
}

interface Products {
  shoeId: string;
  size: string;
  quantity: number;
}

interface OrderTemplateProps {
  orderId: string;
  orderNumber: string;
  orderProducts: Products[];
  shoes: Shoe[];
  price: number;
  status: string;
  clickDetails: (orderId: string) => void;
}

function OrderTemplate(props: OrderTemplateProps) {

  const { t } = useTranslation();
  const navigate = useNavigate();

  const matchingShoes = props.shoes.filter((shoe) =>
    props.orderProducts.some((product) => product.shoeId === shoe._id)
  );

  const getStatusColor = () => {
    switch (props.status) {
      case "submitted":
        return "text-blue-500";
      case "preparing":
        return "text-yellow-500";
      case "shipped":
        return "text-violet-500";
      case "delivered":
        return "text-green-500";
      default:
        return "text-black/80";
    }
  };

  const statusColor = getStatusColor();

  const handleImageClick = (idShoe: string) => {
    navigate(`/shoeView/${idShoe}`);
  };

  return (
    <>
      <div className="w-full py-6 px-10 border-b-2 border-black/10 dark:border-white/30 text-black/80 dark:text-white/80 text-lg md:text-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <p className="hidden sm:flex">{t("order.text1")} </p>
            <p className="font-bold">{props.orderNumber}</p>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <p className="hidden md:block">{t("order.text2")} </p>
              <p className={`font-bold ${statusColor}`}>
                {t(`status.${props.status}`)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap w-[18rem] lg:w-[60%] items-center mt-6 ">
          {matchingShoes.map((shoe) => (
            <div key={shoe._id} onClick={() => handleImageClick(shoe._id)}>
              <LazyLoadImage
                src={shoe.imageUrl}
                alt="Photo of shoes"
                effect="blur"
                placeholderSrc={shoe.imageUrl}
                className=" w-[7rem] -rotate-2 cursor-pointer mr-4 mb-2 "
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center  mt-6 text-base md:text-lg ">
          <div>
            <p>
              {t("order.text3")}{" "}
              <span className="font-bold">{formatPrice(props.price, t)}</span>
            </p>
          </div>

          <div>
            <button
              onClick={() => props.clickDetails(props.orderId)}
              className="font-bold hover:scale-105 ease-in-out duration-300"
            >
              {t("order.text4")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderTemplate;
