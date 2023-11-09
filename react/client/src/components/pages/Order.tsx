import React, { useContext, useEffect, useState } from "react";
import Navbar from "../sections/Navbar";
import { UserContext } from "../elements/UserProvider";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ThemeContext } from "../elements/ThemeContext";
import order_dark from "../../assets/images/order_dark.png";
import order_light from "../../assets/images/order_light.png";
import axios from "axios";
import LoadingAnimationSmall from "../elements/LoadingAnimatonSmall";
import OrderTemplate from "../elements/OrderTemplate";
import { ref, getDownloadURL } from "firebase/storage";
import storage from "../../firebase";
import InfoDivBottom from "../elements/InfoDivBottom";
import { AiOutlineClose } from "react-icons/ai";
import CheckoutProductTemplate from "../elements/CheckoutProductTemplate";
import { formatPrice } from "src/currencyUtils";
import {
  OrderInterface,
  ShoeInterface,
  OrderCustomShoeInterface,
} from "src/types";
import OrderCustomShoeTemplate from "../elements/OrderCustomShoeTemplate";
import PersonalizedShoesView from "../sections/PersonalizedShoesView";

interface Shoe extends ShoeInterface {
  brand: string;
  size?: string;
  quantity?: number;
  _idProduct?: string;
}

function Order() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const { user, isUserLoggedIn, isUserDataLoaded, fetchUserData } =
    useContext(UserContext);

  const [matchingShoes, setMatchingShoes] = useState<Shoe[]>([]);
  const [showDiv, setShowDiv] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [showStandardOrder, setShowStandardOrder] = useState(true);
  const [showDivCustomShoe, setShowDivCustomShoe] = useState(false);
  const [errorsServer, setErrorsServer] = useState("");

  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [orders, setOrders] = useState<OrderInterface[] | null>(null);
  const [orderCustomShoes, setOrderCustomShoes] = useState<
    OrderCustomShoeInterface[] | null
  >(null);
  const [singleOrder, setSingleOrder] = useState<OrderInterface | null>(null);
  const [singleOrderCustomShoes, setSingleOrderCustomShoes] =
    useState<OrderCustomShoeInterface | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (showDivCustomShoe || showDiv) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up the effect
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showDivCustomShoe, showDiv]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const clickDetails = (orderId: string) => {
    setShowDiv(!showDiv);

    if (orders) {
      const singleOrder = orders.filter((order) => order._id === orderId);
      setSingleOrder(singleOrder.length > 0 ? singleOrder[0] : null);
    }
  };

  const clickDetailsCustomShoe = (orderId: string) => {
    setShowDivCustomShoe(!showDivCustomShoe);

    if (orderCustomShoes) {
      const singleOrder = orderCustomShoes.filter(
        (order) => order._id === orderId
      );
      setSingleOrderCustomShoes(singleOrder.length > 0 ? singleOrder[0] : null);
    }
  };

  useEffect(() => {
    if (singleOrder) {
      let totalPrice = 0;

      singleOrder.products.forEach((product) => {
        const matchingShoe = shoes.find((shoe) => shoe._id === product.shoeId);
        if (matchingShoe) {
          totalPrice += matchingShoe.price * product.quantity;
        }
      });

      setTotalPrice(totalPrice);

      if (singleOrder.discount) {
        const discountValue = (totalPrice * singleOrder.discount) / 100;
        const roundedDiscount = Math.round(discountValue * 10) / 10;

        let finalDiscount;
        if (roundedDiscount % 1 === 0.5) {
          finalDiscount = Math.ceil(roundedDiscount);
        } else {
          finalDiscount = Math.floor(roundedDiscount);
        }
        setDiscount(finalDiscount);
      }
    }
  }, [shoes, singleOrder]);

  useEffect(() => {
    const userId = user?._id ? user?._id : "";

    axios
      .get(`/getOrders/?userId=${userId}`)
      .then(async (response) => {
        const fetchedShoes: any[] = response.data.shoes || [];

        const shoeImages = await Promise.all(
          fetchedShoes.map(async (product) => {
            const pathReference = ref(
              storage,
              `/mainPhoto/${product.image}.png`
            );
            const url = await getDownloadURL(pathReference);
            return {
              ...product,
              imageUrl: url,
            };
          })
        );

        setShoes(shoeImages);
        setOrders(response.data.orders);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setErrorsServer(error.response.data.error);
        } else {
          console.log(error);
        }
      });

    axios
      .get(`/getOrderCustomShoe/?userId=${userId}`)
      .then(async (response) => {
        setOrderCustomShoes(response.data.orders);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setErrorsServer(error.response.data.error);
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setIsDataFetched(true);
      });
  }, [user]);

  useEffect(() => {
    // Czyszczenie poprzednich pasujących butów
    setMatchingShoes([]);

    const matchingShoesWithQuantityAndSize: any = [];

    singleOrder?.products.forEach((product) => {
      const matchingShoe = shoes.find((shoe) => shoe._id === product.shoeId);
      if (matchingShoe) {
        const shoeWithDetails = {
          ...matchingShoe,
          size: product.size,
          quantity: product.quantity,
          _idProduct: product._id,
        };
        matchingShoesWithQuantityAndSize.push(shoeWithDetails);
      }
    });

    setMatchingShoes(matchingShoesWithQuantityAndSize);
  }, [singleOrder]);

  return (
    <>
      {showDivCustomShoe && (
        <div className="fixed w-screen h-screen flex justify-center items-center m-auto z-10   bg-black/40 backdrop-blur-sm  ">
          <div className="relative flex flex-col lg:flex-row bg-white dark:bg-black  pt-10 px-2  sm:px-10 xl:px-20 max-h-[80vh] w-full md:w-[90vw]  xl:w-[70rem] overflow-y-auto">
            <div onClick={() => setShowDivCustomShoe(!showDivCustomShoe)}>
              <AiOutlineClose
                size={30}
                color={theme === "dark" ? "white" : "black"}
                className="absolute right-8 top-10 cursor-pointer hover:scale-125"
              />
            </div>
            <p className="absolute top-10 left-10 xl:left-20 text-2xl text-black dark:text-white font-semibold">
              {t("order.text7")} {singleOrderCustomShoes?.orderNumber}
            </p>
            <div className="h-full w-full lg:w-[50%] mt-20 ">
              <p className="text-xl text-black/80  dark:text-white/80">
                {t("order.text8")}
              </p>
              <div className="text-lg text-black/50  dark:text-white/50">
                <p className="mt-6">
                  {t("order.text1")}{" "}
                  <span className="text-black/80  dark:text-white/80">
                    {singleOrderCustomShoes?.orderNumber}
                  </span>
                </p>
                <p className="mt-2">
                  {t("order.text9")}{" "}
                  <span className="text-black/80 dark:text-white/80">
                    {singleOrderCustomShoes
                      ? new Date(
                          singleOrderCustomShoes.orderDate
                        ).toLocaleString()
                      : ""}
                  </span>
                </p>
                <p className="mt-2">
                  {t("order.text10")}{" "}
                  <span className="text-black/80 dark:text-white/80">
                    {singleOrderCustomShoes?.deliveryMethod}
                  </span>
                </p>
                <p className="mt-2">
                  {t("order.text11")}{" "}
                  <span className="text-black/80 dark:text-white/80">
                    {t(`payment.${singleOrderCustomShoes?.paymentMethod}`)}
                  </span>
                </p>
              </div>

              <p className="text-xl text-black/80  dark:text-white/80 mt-10 ">
                {t("order.text12")}
              </p>

              <div className="text-lg text-black/50 dark:text-white/50  pb-10">
                <p className="mt-6">
                  Email:{" "}
                  <span className="text-black/80 dark:text-white/80">
                    {singleOrderCustomShoes?.address.email}
                  </span>
                </p>
                <p className="mt-2">
                  {t("checkout.text23")}{" "}
                  <span className="text-black/80 dark:text-white/80">
                    {singleOrderCustomShoes?.address.name}{" "}
                    {singleOrderCustomShoes?.address.surname}
                  </span>
                </p>

                <p className="mt-2">
                  {t("checkout.text24")}{" "}
                  <span className="text-black/80 dark:text-white/80">
                    {singleOrderCustomShoes?.address.telephone}
                  </span>
                </p>
                <p className="mt-2">
                  {t("checkout.text25")}{" "}
                  <span className="text-black/80 dark:text-white/80">
                    {singleOrderCustomShoes?.address.street},
                  </span>
                </p>
                <p className="mt-2 text-black/80 dark:text-white/80">
                  {singleOrderCustomShoes?.address.postalCode}{" "}
                  {singleOrderCustomShoes?.address.city},
                </p>
                <p className="mt-2 text-black/80 dark:text-white/80">
                  {t(`country.${singleOrderCustomShoes?.address.country}`)}
                </p>
              </div>
            </div>

            <div className="h-full w-full lg:w-[50%]  lg:mt-20  ">
              <div className="flex justify-center transform scale-[80%] sm:scale-[90%] md:scale-[100%] lg:scale-[110%]">
                {singleOrderCustomShoes && (
                  <PersonalizedShoesView
                    selectedColors={
                      singleOrderCustomShoes.project.selectedColors
                    }
                    selectedColorsText={
                      singleOrderCustomShoes.project.selectedColorsText
                    }
                    selectedPatches={
                      singleOrderCustomShoes.project.selectedPatches
                    }
                    swooshVisibility={
                      singleOrderCustomShoes.project.swooshVisibility
                    }
                    sideText={singleOrderCustomShoes.project.sideText}
                    orderNumber={singleOrderCustomShoes.orderNumber}
                  />
                )}
              </div>

              <div className="h-[1px] w-full bg-black/50 dark:bg-white/50 mt-6"></div>
              <div className="flex flex-col space-y-2 text-lg text-black/80 dark:text-white/80 text-end mt-6 pb-10">
                <p>
                  {t("order.text15")}{" "}
                  {singleOrderCustomShoes?.deliveryMethod && (
                    <span className="font-bold">
                      {singleOrderCustomShoes?.deliveryMethod ===
                      "Poczta Polska"
                        ? formatPrice(4, t)
                        : formatPrice(0, t)}
                    </span>
                  )}
                </p>

                <p>
                  {t("order.text3")}{" "}
                  {singleOrderCustomShoes && (
                    <span className="font-bold">
                      {formatPrice(singleOrderCustomShoes.price, t)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDiv && (
        <div className="fixed w-screen h-screen flex justify-center items-center m-auto z-10   bg-black/40 backdrop-blur-sm  ">
          <div className="relative flex flex-col lg:flex-row bg-white dark:bg-black  pt-10 px-10 xl:px-20 max-h-[80vh] w-[90vw]  xl:w-[70rem] overflow-y-auto">
            <div onClick={() => setShowDiv(!showDiv)}>
              <AiOutlineClose
                size={30}
                color={theme === "dark" ? "white" : "black"}
                className="absolute right-8 top-10 cursor-pointer hover:scale-125"
              />
            </div>
            <p className="absolute top-10 left-10 xl:left-20 text-2xl text-black dark:text-white font-semibold">
              {t("order.text7")} {singleOrder?.orderNumber}
            </p>
            <div className="h-full w-full lg:w-[50%] mt-20 ">
              <p className="text-xl text-black/80  dark:text-white/80">
                {t("order.text8")}
              </p>
              <div className="text-lg text-black/50  dark:text-white/50">
                <p className="mt-6">
                  {t("order.text1")}{" "}
                  <span className="text-black/80  dark:text-white/80">
                    {singleOrder?.orderNumber}
                  </span>
                </p>
                <p className="mt-2">
                  {t("order.text9")}{" "}
                  <span className="text-black/80 dark:text-white/80">
                    {singleOrder
                      ? new Date(singleOrder.orderDate).toLocaleString()
                      : ""}
                  </span>
                </p>
                <p className="mt-2">
                  {t("order.text10")}{" "}
                  <span className="text-black/80 dark:text-white/80">
                    {singleOrder?.deliveryMethod}
                  </span>
                </p>
                <p className="mt-2">
                  {t("order.text11")}{" "}
                  <span className="text-black/80 dark:text-white/80">
                    {t(`payment.${singleOrder?.paymentMethod}`)}
                  </span>
                </p>
              </div>

              <p className="text-xl text-black/80  dark:text-white/80 mt-10 ">
                {t("order.text12")}
              </p>

              <div className="text-lg text-black/50 dark:text-white/50  pb-10">
                <p className="mt-6">
                  Email:{" "}
                  <span className="text-black/80 dark:text-white/80">
                    {singleOrder?.address.email}
                  </span>
                </p>
                <p className="mt-2">
                  {t("checkout.text23")}{" "}
                  <span className="text-black/80 dark:text-white/80">
                    {singleOrder?.address.name} {singleOrder?.address.surname}
                  </span>
                </p>

                <p className="mt-2">
                  {t("checkout.text24")}{" "}
                  <span className="text-black/80 dark:text-white/80">
                    {singleOrder?.address.telephone}
                  </span>
                </p>
                <p className="mt-2">
                  {t("checkout.text25")}{" "}
                  <span className="text-black/80 dark:text-white/80">
                    {singleOrder?.address.street},
                  </span>
                </p>
                <p className="mt-2 text-black/80 dark:text-white/80">
                  {singleOrder?.address.postalCode} {singleOrder?.address.city},
                </p>
                <p className="mt-2 text-black/80 dark:text-white/80">
                  {t(`country.${singleOrder?.address.country}`)}
                </p>
              </div>
            </div>

            <div className="h-full w-full lg:w-[50%]  lg:mt-20  ">
              <p className="text-xl text-black/80  dark:text-white/80 mb-10">
                {t("order.text13")}
              </p>
              {matchingShoes.map((product) => (
                <div key={product._idProduct}>
                  <CheckoutProductTemplate
                    key={product._idProduct}
                    imageUrl={product.imageUrl || ""}
                    brand={product.brand}
                    name={product.name}
                    cartSize={product.size || ""}
                    cartQuantity={product.quantity || 0}
                    price={product.price}
                  />
                </div>
              ))}
              <div className="h-[1px] w-full bg-black/50 dark:bg-white/50 mt-6"></div>
              <div className="flex flex-col space-y-2 text-lg text-black/80 dark:text-white/80 text-end mt-6 pb-10">
                <p>
                  {t("order.text15")}{" "}
                  {singleOrder?.deliveryMethod && (
                    <span className="font-bold">
                      {singleOrder?.deliveryMethod === "Poczta Polska"
                        ? formatPrice(4, t)
                        : formatPrice(0, t)}
                    </span>
                  )}
                </p>

                {singleOrder?.discount && (
                  <p>
                    {" "}
                    {t("order.text14")} {""}
                    <span className="font-bold">
                      -{formatPrice(discount, t)}
                    </span>
                  </p>
                )}

                <p>
                  {t("order.text3")}{" "}
                  {singleOrder && (
                    <span className="font-bold">
                      {formatPrice(singleOrder.price, t)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-black/10 dark:bg-black/80 pb-20 min-h-screen ">
        <Navbar
          background="bg-white"
          shadow="none"
          extra="border-b border-black/20 dark:border-white/20"
        />

        <div className="flex justify-center">
          {errorsServer && (
            <InfoDivBottom color="bg-red-500" text={errorsServer} />
          )}
        </div>

        <div className="flex justify-center items-center bg-white dark:bg-[#292929] h-[13rem]">
          <div className="flex flex-col lg:relative justify-center items-center w-[1200px] mt-12 lg:mt-0">
            <div className="lg:absolute lg:left-14 xl:left-0 mb-10 lg:mb-0">
              {isUserDataLoaded && (
                <p className="text-4xl text-black/80 dark:text-white/80">
                  {t("profile.hello")}{" "}
                  {user?.name
                    ? user.name.charAt(0)?.toUpperCase() + user.name.slice(1)
                    : ""}
                </p>
              )}

              <p className="text-center lg:text-left text-lg text-black/70 dark:text-white/70 mt-2">
                {t("order.text5")}
              </p>
            </div>

            <div className="flex items-center sm:space-x-2 lg:mt-40">
              <Link
                to={"/profile"}
                className="text-xl lg:text-2xl  text-black/50 dark:text-white/50  px-4 h-[3rem] hover:border-b-4  hover:border-black hover:dark:border-white cursor-pointer"
              >
                {t("profile.myprofile")}
              </Link>
              <Link
                to={"/address"}
                className="text-xl lg:text-2xl text-black/50 dark:text-white/50 px-4 h-[3rem] hover:border-b-4 h hover:border-black hover:dark:border-white cursor-pointer "
              >
                {t("profile.address")}
              </Link>
              <p className="text-xl lg:text-2xl text-black/80 dark:text-white/80  px-4 h-[3rem] border-b-4  border-black dark:border-white cursor-default">
                {t("profile.orders")}
              </p>
            </div>

            <img
              src={theme === "dark" ? order_light : order_dark}
              className="hidden lg:block h-[7.5rem] w-[7.5rem] absolute right-14 xl:right-0 -bottom-1"
            />
          </div>
        </div>
        {!isDataFetched ? (
          <div className="flex justify-center items-center h-[50vh]">
            <LoadingAnimationSmall />
          </div>
        ) : (
          <>
            <div className="flex justify-center items-center mt-10 space-x-10">
              <button
                onClick={() => setShowStandardOrder(true)}
                className="px-4 py-3 text-black  dark:text-white rounded-full border-2 border-black/60 dark:border-white/70 hover:bg-black/80 hover:text-white hover:dark:text-black hover:dark:bg-white"
              >
                <p> {t("order.text16")}</p>
              </button>
              <button
                onClick={() => setShowStandardOrder(false)}
                className="px-4 py-3 text-black  dark:text-white rounded-full border-2 border-black/60 dark:border-white/70 hover:bg-black/80 hover:text-white hover:dark:text-black hover:dark:bg-white"
              >
                <p> {t("order.text17")}</p>
              </button>
            </div>

            {showStandardOrder ? (
              <div className="flex flex-col  mx-auto  bg-white dark:bg-[#292929] w-full lg:w-[1000px]  mt-10">
                {orders?.length === 0 ? (
                  <p className="text-lg xl:text-2xl text-black/80 dark:text-white/80 text-center py-10">
                    {t("order.text6")}
                  </p>
                ) : (
                  <>
                    {orders?.map((order) => (
                      <div key={order._id}>
                        <OrderTemplate
                          orderId={order._id}
                          orderNumber={order.orderNumber}
                          orderProducts={order.products}
                          shoes={shoes}
                          price={order.price}
                          status={order.status}
                          clickDetails={clickDetails}
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col  mx-auto  bg-white dark:bg-[#292929] w-full lg:w-[1000px]   mt-10 ">
                {orderCustomShoes?.length === 0 ? (
                  <p className="text-lg xl:text-2xl text-black/80 dark:text-white/80 text-center py-10">
                    {t("order.text6")}
                  </p>
                ) : (
                  orderCustomShoes?.map((product) => (
                    <div key={product._id}>
                      <OrderCustomShoeTemplate
                        _id={product._id}
                        orderNumber={product.orderNumber}
                        status={product.status}
                        price={product.price}
                        project={product.project}
                        clickDetails={clickDetailsCustomShoe}
                      />
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Order;
