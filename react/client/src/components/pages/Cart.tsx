import React, { useEffect, useContext, useState } from "react";
import Navbar from "../sections/Navbar";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { AiOutlineDown, AiOutlineUp, AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../elements/UserProvider";
import LoadingAnimationSmall from "../elements/LoadingAnimatonSmall";
import CartProductTemplate from "../elements/CartProductTemplate";
import { ref, getDownloadURL } from "firebase/storage";
import storage from "../../firebase";
import { CartContext } from "../elements/CartProvider";
import { ThemeContext } from "../elements/ThemeContext";
import InfoDivBottom from "../elements/InfoDivBottom";
import { useTranslation } from "react-i18next";
import { formatPrice } from "src/currencyUtils";
import { ProductInterface } from "src/types";

function Cart() {
  const { t } = useTranslation();
  const { theme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const {
    quantityCart,
    setQuantityCart,
    discountName,
    discountAmount,
    setDiscountName,
    setDiscountAmount,
  } = useContext(CartContext);
  const { user, isUserLoggedIn, isUserDataLoaded } = useContext(UserContext);
  const currentCode = localStorage.getItem("i18nextLng");

  const [shoes, setShoes] = useState<ProductInterface[]>([]);
  const [dataFetched, setDataFetched] = useState(true);
  const [errorServer, setErrorServer] = useState("");
  const [error, setError] = useState("");

  const [discountNameTemporary, setDiscountNameTemporary] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [showDiscountDiv, setShowDiscountDiv] = useState(false);

  const discountValue = (totalPrice * discountAmount) / 100;
  const roundedDiscount = Math.round(discountValue * 10) / 10; // Zaokrąglenie do jednego miejsca po przecinku

  let finalDiscount;
  if (roundedDiscount % 1 === 0.5) {
    finalDiscount = Math.ceil(roundedDiscount); // Zaokrąglanie do góry, gdy wartość dziesiętna jest równa 0.5
  } else {
    finalDiscount = Math.floor(roundedDiscount); // Zaokrąglanie w dół, gdy wartość dziesiętna nie jest równa 0.5
  }
  const priceAfterDiscount = totalPrice - finalDiscount;

  const handleDiscountNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDiscountNameTemporary(event.target.value);
    setError("");
  };

  const updateQuantityInShoes = (
    shoeId: string,
    size: string,
    newQuantity: number
  ) => {
    setShoes((prevShoes) =>
      prevShoes.map((product) => {
        if (product.shoe._id === shoeId && product.size === size) {
          return { ...product, quantity: newQuantity };
        }
        return product;
      })
    );
  };

  const calculateTotalPrice = (shoes: ProductInterface[]) => {
    let totalPrice = 0;
    shoes.forEach((product) => {
      totalPrice += product.quantity * product.shoe.price;
    });
    setTotalPrice(totalPrice);
  };

  useEffect(() => {
    calculateTotalPrice(shoes);
  }, [shoes]);

  useEffect(() => {
    const userId = user ? user._id : "";

    setDataFetched(false);

    axios
      .get(`/getShoesCart?userId=${userId}`)
      .then(async (response) => {
        setShoes(response.data.shoesWithCartSizes);

        const fetchedShoes: any[] = response.data.shoesWithCartSizes || [];

        const shoeImages = await Promise.all(
          fetchedShoes.map(async (product) => {
            const pathReference = ref(
              storage,
              `/mainPhoto/${product.shoe.image}.png`
            );
            const url = await getDownloadURL(pathReference);
            return {
              ...product,
              imageUrl: url,
            };
          })
        );

        setShoes(shoeImages);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setErrorServer(error.response.data.error);
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setDataFetched(true);
      });
  }, [user]);

  const handleDeleteCart = (cartId: string) => {
    setShoes((prevShoes) =>
      prevShoes.filter((product) => product._id !== cartId)
    );
    setQuantityCart(quantityCart - 1);
  };

  const handleSubmitDiscount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!discountNameTemporary) {
      const message = t("cart.text14");
      setError(message);
      return;
    }

    const requestData = {
      userId: "",
      discountName: discountNameTemporary,
    };

    if (user?._id) {
      requestData.userId = user._id;
    }

    axios
      .post("/saveDiscount", requestData)
      .then((response) => {
        if (response.data.message) {
          const message = t("cart.text15");
          setError(message);
        } else {
          const { discountAmount, discountName } = response.data;
          setShowDiscountDiv(false);
          setDiscountNameTemporary("");
          setDiscountName(discountName);
          setDiscountAmount(discountAmount);
        }
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setErrorServer(error.response.data.error);
        } else {
          console.log(error);
        }
      });
  };

  useEffect(() => {
    const userId = user ? user._id : "";

    setDataFetched(false);

    axios
      .get(`/getDiscount?userId=${userId}`)
      .then((response) => {
        const { discountAmount, discountName } = response.data;

        setDiscountName(discountName);
        setDiscountAmount(discountAmount);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setErrorServer(error.response.data.error);
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setDataFetched(true);
      });
  }, []);

  const handleDeleteDiscount = () => {
    const userId = user?._id ? user?._id : "";

    axios
      .post("/deleteDiscount", { userId: userId })
      .then((response) => {
        setDiscountName("");
        setDiscountAmount(0);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setErrorServer(error.response.data.error);
        } else {
          console.log(error);
        }
      });
  };

  return (
    <div className="bg-white dark:bg-black/80 pb-[8rem] xl:pb-[16rem] min-h-screen ">
      <Navbar
        background="bg-white"
        shadow="none"
        extra="border-b border-black/20 dark:border-white/20"
      />
      {!dataFetched ? (
        <div className="flex justify-center items-center h-[50vh]">
          <LoadingAnimationSmall />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="flex justify-center">
            {errorServer && (
              <InfoDivBottom color="bg-red-500" text={errorServer} />
            )}
          </div>

          {shoes.length === 0 ? (
            <>
              <div className="flex justify-center mt-12 items-center space-x-2">
                <HiOutlineShoppingBag
                  size={35}
                  color={theme === "dark" ? "white" : "black"}
                />
                <p className="text-3xl text-black dark:text-white">
                  {" "}
                  {t("cart.text1")}
                </p>
              </div>
              <p className="text-xl text-black/70 dark:text-white/70 mt-8">
                {t("cart.text2")}{" "}
              </p>

              <button
                onClick={() => navigate("/shop")}
                className="px-2 h-[3rem] text-white rounded-md bg-[#59c9fd] mt-8 hover:scale-105 ease-in-out duration-500"
              >
                {t("cart.text3")}
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center mt-12 space-x-2">
              <div className="flex flex-col xl:flex-row justify-center items-center xl:items-start xl:w-screen xl:space-x-[1rem] pc:space-x-[12rem]">
                <div className="flex flex-col">
                  <div className="flex justify-center xl:justify-start relative w-screen xl:w-[50rem] 2xl:w-[55rem] mt-2 mb-4">
                    <div className="flex ">
                      <HiOutlineShoppingBag
                        size={35}
                        color={theme === "dark" ? "white" : "black"}
                      />
                      <p className="text-3xl text0black dark:text-white">
                        {t("cart.text4")} ({quantityCart})
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col ">
                    {shoes.map((product) => (
                      <div key={product._id}>
                        <CartProductTemplate
                          _id={product._id}
                          idShoe={product.shoe._id}
                          imageUrl={product.imageUrl || ""}
                          brand={product.shoe.brand}
                          name={product.shoe.name}
                          cartSize={product.size}
                          price={product.shoe.price}
                          sizes={product.shoe.sizes}
                          cartQuantity={product.quantity}
                          discountPrice={product.shoe.discountPrice}
                          updateQuantityInShoes={updateQuantityInShoes}
                          onDelete={handleDeleteCart}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col mt-10 xl:mt-0">
                  <div className="w-[25rem] pb-6 border-[1px] border-black/20 dark:border-white/20 rounded-md">
                    <p className="text-2xl text-black dark:text-white py-4 mx-4 border-b-[1px] border-black/20 dark:border-white/20">
                      {t("cart.text5")}
                    </p>

                    <div className="flex justify-between px-4 mt-4">
                      <p className="text-black text-lg dark:text-white  ">
                        {t("cart.text6")}
                      </p>
                      <p className="text-black text-lg dark:text-white  ">
                        {formatPrice(totalPrice, t)}
                      </p>
                    </div>

                    {discountAmount !== 0 && (
                      <div className="flex justify-between mx-4  mt-4">
                        <p className="flex items-center text-black text-lg dark:text-white  ">
                          {t("cart.text16")} {discountName}
                          <AiOutlineClose
                            onClick={handleDeleteDiscount}
                            className="ml-1 cursor-pointer hover:bg-black/10"
                          />
                        </p>
                        <p className=" text-lg text-red-500 ">
                          - {formatPrice(finalDiscount, t)}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between mx-4 pb-4 mt-4 border-b-[1px] border-black/20 dark:border-white/20">
                      <p className="text-black text-lg dark:text-white">
                        {t("cart.text7")}
                      </p>
                      <p className="text-black text-lg dark:text-white ">
                        {currentCode !== "pl" ? "$0.00" : "0 zł"}{" "}
                      </p>
                    </div>

                    <div className="flex justify-between mx-4 pb-4 mt-4 ">
                      <p className="text-black text-lg dark:text-white">
                        {t("cart.text8")}
                      </p>
                      <p className="text-black text-xl font-bold dark:text-white">
                        {formatPrice(priceAfterDiscount, t)}
                      </p>
                    </div>

                    <button
                      onClick={() => navigate("/checkout")}
                      className="flex justify-center items-center w-[95%] mx-auto h-[3.5rem] bg-[#97DEFF] rounded-lg mt-4 hover:bg-[#1fb7fe]"
                    >
                      <p className="text-black/80 text-xl ">
                        {t("cart.text9")}
                      </p>
                    </button>
                  </div>

                  <div className="px-4 w-[25rem] border-[1px] border-black/20 dark:border-white/20 rounded-md mt-4">
                    <button
                      onClick={() => setShowDiscountDiv(!showDiscountDiv)}
                      className="flex justify-between items-center w-full"
                    >
                      <p className="text-xl text-black dark:text-white py-4 ">
                        {t("cart.text10")}
                      </p>
                      {showDiscountDiv ? (
                        <AiOutlineUp
                          size={20}
                          color={theme === "dark" ? "white" : "black"}
                        />
                      ) : (
                        <AiOutlineDown
                          size={20}
                          color={theme === "dark" ? "white" : "black"}
                        />
                      )}
                    </button>

                    {showDiscountDiv && (
                      <form className="pb-4 " onSubmit={handleSubmitDiscount}>
                        <div className="flex space-x-4 ">
                          <input
                            value={discountNameTemporary}
                            onChange={handleDiscountNameChange}
                            className="w-[65%] bg-transparent h-[3rem] border-2 border-black/50 dark:border-white/50 px-2 focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white"
                            placeholder={t("cart.text11") as string}
                          />
                          <button
                            type="submit"
                            className="h-[3rem] w-[30%] text-black dark:text-white border-2 border-black/50 dark:border-white/50 hover:bg-black/10 dark:hover:bg-white/10"
                          >
                            {t("cart.text12")}
                          </button>
                        </div>
                        {error && (
                          <p className="text-red-500 text-sm mt-2">{error}</p>
                        )}
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Cart;
