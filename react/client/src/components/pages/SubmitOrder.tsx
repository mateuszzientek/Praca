import React, { useContext } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import orderPlaced from "../../assets/images/orderPlaced.png";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../elements/UserProvider";
import { useTranslation } from "react-i18next";

function SubmitOrder() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useContext(UserContext);

  return (
    <div className="flex flex-col w-screen min-h-screen items-center pb-10 bg-white dark:bg-black/80">
      <div></div>
      <LazyLoadImage
        src={orderPlaced}
        alt="Order Placed"
        className="w-[5rem] mt-10 md:mt-28"
        effect="blur"
        placeholderSrc={orderPlaced}
      />
      <p className="text-black/80 dark:text-white/80 text-4xl mt-8 text-center w-[90%]">
        {t("submitOrder.text1")}
      </p>
      <p className="text-black/50 dark:text-white/50  text-2xl mt-8 w-[80%] lg:w-[52rem] text-center ">
        {t("submitOrder.text2")}
        {user && <span className="ml-1">{t("submitOrder.text3")}</span>}
        {!user && <span className="ml-1">{t("submitOrder.text4")}</span>}
      </p>

      <div className="flex items-center space-x-4 mt-4">
        {user && (
          <button
            onClick={() => navigate("/order")}
            className=" h-[3.5rem] rounded-full px-4 bg-[#97DEFF] mt-6 hover:bg-[#48c5ff]"
          >
            <p className="text-xl text-black/80"> {t("submitOrder.text5")}</p>
          </button>
        )}
        <button
          onClick={() => navigate("/")}
          className={` h-[3.5rem] rounded-full px-4 border-2 border-[#97DEFF] mt-6  ${
            !user
              ? "bg-[#97DEFF] hover:bg-[#48c5ff]"
              : "bg-transparent hover:bg-[#97DEFF]"
          } hover:text-black/80`}
        >
          <p className="text-xl text-black/80 dark:text-white/80 ">
            {t("submitOrder.text6")}
          </p>
        </button>
      </div>
    </div>
  );
}

export default SubmitOrder;
