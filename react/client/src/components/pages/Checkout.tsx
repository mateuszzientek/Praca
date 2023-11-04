import React, { useContext, useState, useEffect } from "react";
import { TbTruckReturn, TbTruck } from "react-icons/tb";
import { AiOutlineDown, AiOutlineUp, AiOutlineClose } from "react-icons/ai";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import logo from "../../assets/images/logo.png";
import logo2 from "../../assets/images/logo-black.png";
import { ThemeContext } from "../elements/ThemeContext";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import CheckoutProductTemplate from "../elements/CheckoutProductTemplate";
import axios from "axios";
import { UserContext } from "../elements/UserProvider";
import { ref, getDownloadURL } from "firebase/storage";
import storage from "../../firebase";
import LoadingAnimationSmall from "../elements/LoadingAnimatonSmall";
import { CartContext } from "../elements/CartProvider";
import { formatPrice } from "src/currencyUtils";
import { useTranslation } from "react-i18next";
import InputCheckout from "../elements/InputCheckout";
import AddressTemplateCheckout from "../elements/AddressTemplateCheckout";
import InfoDivBottom from "../elements/InfoDivBottom";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import CircleSvg from "../elements/CircleSvg";
import { ErrorInterface, AddressInterface, ProductInterface } from "src/types";

interface Address extends AddressInterface {
  email: string;
}

function Checkout() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isUserLoggedIn } = useContext(UserContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const {
    discountName,
    discountAmount,
    setDiscountName,
    setDiscountAmount,
    quantityCart,
    setQuantityCart,
  } = useContext(CartContext);

  const typeAddress = ["individual", "company"];
  const countries = [
    {
      name: "poland",
      code: "pl",
    },
    {
      name: "united_kingdom",
      code: "gb",
    },
    {
      name: "ukraine",
      code: "ua",
    },
    {
      name: "germany",
      code: "de",
    },
    {
      name: "czech_republic",
      code: "cz",
    },
  ];

  const delivery = [
    {
      name: "Poczta Polska",
      price: 4,
      image: "poczta",
      deliveryTime: "2-4",
    },
    {
      name: "Kurier Inpost",
      price: 0,
      image: "inpost",
      deliveryTime: "1-2",
    },
  ];

  const payment = [
    {
      name: "cod",
      image: "cod",
    },
  ];

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [dataFetched, setDataFetched] = useState(true);
  const [shoes, setShoes] = useState<ProductInterface[]>([]);
  const [selectedTypeAddress, setSelectedTypeAddress] = useState("individual");
  const [selectedDelivery, setSelectedDelivery] = useState({
    name: "Kurier Inpost",
    price: 0,
  });

  const [showLoading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState({ name: "" });
  const [showCountryDiv, setShowCountryDiv] = useState(false);
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorsServer, setErrorsServer] = useState("");
  const [showAddressDiv, setShowAddressDiv] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [telephone, setTelephone] = useState("");
  const [extra, setExtra] = useState("");
  const [country, setCountry] = useState("");

  const [errorsVadlidationServer, setErrorsVadlidationServer] = useState<
    ErrorInterface[]
  >([]);

  const [errors, setErrors] = useState({
    email: "",
    name: "",
    surname: "",
    street: "",
    city: "",
    postalCode: "",
    telephone: "",
    country: "",
  });

  const [errorsChecked, setErrorsChecked] = useState({
    payment: "",
    terms: "",
  });

  const validateData = () => {
    const newErrors = {
      email: "",
      name: "",
      surname: "",
      street: "",
      city: "",
      postalCode: "",
      telephone: "",
      country: "",
    };

    if (email && !validator.isEmail(email)) {
      newErrors.email = t("loginError.email");
    }

    if (name && !/^[a-zA-Z]+$/.test(name)) {
      newErrors.name = t("loginError.name");
    }

    if (surname && !/^[a-zA-Z]+$/.test(surname)) {
      newErrors.surname = t("loginError.surname");
    }

    if (street) {
      if (!/^(?=.*[a-zA-Z]{3,})(?=.*\d).*$/.test(street)) {
        newErrors.street = t("address.error1");
      }
    }

    if (city && !/^[a-zA-Z\s]*$/.test(city)) {
      newErrors.city = t("address.error2");
    }

    if (postalCode && !/^\d{2}-\d{3}$/.test(postalCode)) {
      newErrors.postalCode = t("address.error3");
    }

    if (telephone && !/^[1-9]\d{8}$/.test(telephone)) {
      newErrors.telephone = t("address.error4");
    }

    setErrors(newErrors);

    return (
      Object.keys(
        newErrors.email ||
        newErrors.name ||
        newErrors.surname ||
        newErrors.street ||
        newErrors.city ||
        newErrors.postalCode ||
        newErrors.telephone
      ).length === 0
    );
  };

  const handleBlur = () => {
    validateData();
  };

  useEffect(() => {
    if (showAddressDiv) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up the effect
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showAddressDiv]);

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

  const discountValue = (totalPrice * discountAmount) / 100;
  const roundedDiscount = Math.round(discountValue * 10) / 10; // Zaokrąglenie do jednego miejsca po przecinku

  let finalDiscount;
  if (roundedDiscount % 1 === 0.5) {
    finalDiscount = Math.ceil(roundedDiscount); // Zaokrąglanie do góry, gdy wartość dziesiętna jest równa 0.5
  } else {
    finalDiscount = Math.floor(roundedDiscount); // Zaokrąglanie w dół, gdy wartość dziesiętna nie jest równa 0.5
  }
  const priceAfterDiscount =
    totalPrice - finalDiscount + selectedDelivery.price;

  const handleTermsChange = () => {
    setTerms(!terms);
    setErrorsChecked((prevErrorsChecked) => ({
      ...prevErrorsChecked,
      terms: "", // Zmieniamy na pusty ciąg znaków
    }));
  };

  const handleDeliveryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    const selectedDeliveryData = delivery.find(
      (item) => item.name === selectedValue
    );

    if (selectedDeliveryData) {
      setSelectedDelivery({
        name: selectedDeliveryData.name,
        price: selectedDeliveryData.price,
      });
    } else {
      // Jeśli selectedDeliveryData jest undefined, można podjąć odpowiednie działanie,
      // np. ustawić wartość domyślną lub wyświetlić błąd
      console.log("Nie znaleziono pasującej dostawy!");
    }
  };

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    const selectedPayment = payment.find((item) => item.name === selectedValue);

    if (selectedPayment) {
      setSelectedPayment({ name: selectedPayment?.name });
    } else {
      console.log("Nie znaleziono pasującej dostawy!");
    }

    setErrorsChecked((prevErrorsChecked) => ({
      ...prevErrorsChecked,
      payment: "", // Zmieniamy na pusty ciąg znaków
    }));
  };

  const handleTypeAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedTypeAddress(event.target.value);
  };

  const handleChangeCountry = (name: string) => {
    setCountry(name);
    setShowCountryDiv(false);
  };

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
          setErrorsServer(error.response.data.error);
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setDataFetched(true);
      });
  }, [user]);

  useEffect(() => {
    const userId = user?._id ? user?._id : "";

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
          setErrorsServer(error.response.data.error);
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setDataFetched(true);
      });
  }, []);

  useEffect(() => {
    setDataFetched(false);

    if (user) {
      axios
        .get(`/getAddresses/?userId=${user?._id}`)
        .then((response) => {
          setAddresses(response.data.addresses);

          const defaultAddress = response.data.addresses.find(
            (address: AddressInterface) => address.isDefault === true
          );
          setDefaultAddress(defaultAddress);
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
          setDataFetched(true);
        });
    }
  }, []);

  useEffect(() => {
    if (defaultAddress) {
      setEmail((prevEmail) => prevEmail || user?.email || "");
      setName(capitalizeFirstLetter(defaultAddress.name));
      setSurname(capitalizeFirstLetter(defaultAddress.surname));
      setStreet(capitalizeFirstLetter(defaultAddress.street));
      setCity(capitalizeFirstLetter(defaultAddress.city));
      setPostalCode(defaultAddress.postalCode);
      setTelephone(defaultAddress.telephone);
      setExtra(defaultAddress.extra);
      setCountry(defaultAddress.country);
    }
  }, [defaultAddress]);

  const handleSetDefaultAddress = (addressId: string) => {
    axios
      .post("/changeDefaultAddress", {
        addressId: addressId,
        userId: user?._id,
      })
      .then((response) => {
        const selectedAddress = addresses.find(
          (address) => address._id === addressId
        );

        if (selectedAddress) {
          setDefaultAddress(selectedAddress);
          setAddresses((prevAddresses) =>
            prevAddresses.map((address) =>
              address._id === addressId
                ? { ...address, isDefault: true }
                : { ...address, isDefault: false }
            )
          );

          setShowAddressDiv(false);
        }
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
  };

  const handleLoginClick = () => {
    localStorage.setItem("changeCart", "true");
    navigate("/login");
  };

  const handleSubmit = () => {
    const isValid = validateData();

    if (
      !email ||
      !name ||
      !surname ||
      !street ||
      !city ||
      !postalCode ||
      !telephone ||
      !country
    ) {
      // Przynajmniej jedno z pól jest puste
      setErrors({
        email: !email ? t("loginError.emailReq") : "",
        name: !name ? t("loginError.nameReq") : "",
        surname: !surname ? t("loginError.surnameReq") : "",
        street: !street ? t("address.streetReq") : "",
        city: !city ? t("address.cityReq") : "",
        postalCode: !postalCode ? t("address.postalCodeReq") : "",
        telephone: !telephone ? t("address.telephoneReq") : "",
        country: !country ? t("address.countryReq") : "",
      });
      return;
    }

    if (selectedPayment.name === "" || !terms) {
      setErrorsChecked({
        terms: !terms ? t("checkout.text27") : "",
        payment: selectedPayment.name === "" ? t("checkout.text27") : "",
      });
      return;
    }

    if (isValid) {
      setLoading(true);

      const userId = user ? user._id : "";

      const newShoesArray = shoes.map((shoe) => ({
        shoeId: shoe.shoe._id,
        size: shoe.size,
        quantity: shoe.quantity,
      }));

      const data = {
        userId,
        shoes: newShoesArray,
        paymentMethod: selectedPayment.name,
        deliveryMethod: selectedDelivery.name,
        price: priceAfterDiscount,
        email,
        name,
        surname,
        street,
        city,
        postalCode,
        telephone,
        extra,
        country,
        discount: discountAmount,
      };

      axios
        .post("/saveOrder", data)
        .then((response) => {
          if (response.data.outOfStack) {
            setErrorsServer(response.data.outOfStack);
            return;
          }
          setQuantityCart(0);
          setDiscountAmount(0);
          setDiscountName("");
          navigate("/submitOrder");
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            setErrorsServer(error.response.data.error);
          } else if (
            error.response &&
            error.response.data &&
            error.response.data.errors
          ) {
            setErrorsVadlidationServer(error.response.data.errors);
          } else {
            console.log(error);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      {errorsServer && (
        <div className="flex justify-center">
          <InfoDivBottom color="bg-red-500" text={errorsServer} />
        </div>
      )}

      {errorsVadlidationServer.length > 0 && (
        <InfoDivBottom
          color="bg-red-500"
          text={errorsVadlidationServer.map((error) => error.msg).join(", ")}
        />
      )}

      {showAddressDiv && (
        <div className="fixed bg-black/40 w-full h-screen z-10 flex justify-center items-center backdrop-blur-sm overflow-y-auto min-h-screen">
          <div className="relative flex flex-col items-start justify-center pb-10 bg-white dark:bg-black my-20 rounded-lg max-h-[80vh] w-[90vw] sm:w-[50rem] xl:w-[70rem]">
            {/* Rest of your content */}
            <AiOutlineClose
              size={25}
              onClick={() => setShowAddressDiv(!showAddressDiv)}
              color={theme === "dark" ? "white" : "black"}
              className="absolute right-6 top-5 cursor-pointer hover:scale-125"
            />
            <p className="text-2xl text-black/80 dark:text-white/80 mx-auto mt-4">
              {t("checkout.text1")}
            </p>
            <div className="h-[1px] w-full bg-black/20 dark:bg-white/20 mt-4"></div>
            <div className="flex flex-wrap gap-20 gap-y-2 pl-12 xl:px-28 mx-auto mt-10 max-h-[80vh] overflow-y-auto">
              {addresses.map((address) => (
                <div key={address._id}>
                  <AddressTemplateCheckout
                    addressId={address._id}
                    name={address.name}
                    surname={address.surname}
                    street={address.street}
                    city={address.city}
                    postalCode={address.postalCode}
                    telephone={address.telephone}
                    extra={address.extra}
                    country={address.country}
                    isDefault={address.isDefault}
                    handleSetDefaultAddress={handleSetDefaultAddress}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#313131] pb-[8rem]  min-h-screen ">
        <div
          className={`flex justify-center w-screen  items-center h-32  md:px-20 mx-auto pt-1 border-b-[1px] border-black/20`}
        >
          <div className="flex items-center justify-center lg:justify-between w-[90rem]  h-full">
            <div className="flex items-center space-x-6 xl:space-x-10">
              <LazyLoadImage
                onClick={() => navigate("/")}
                src={theme === "dark" ? logo2 : logo}
                alt="Logo firmy"
                className="dark:h-20 h-16 w-48 -rotate-6 cursor-pointer"
                effect="blur"
                placeholderSrc={theme === "dark" ? logo2 : logo}
              />

              <p className="text-black/80 dark:text-white/80 text-4xl ">
                {t("checkout.text2")}
              </p>
            </div>

            <div className="hidden lg:flex items-center space-x-10">
              <div className="flex items-center space-x-2">
                <TbTruckReturn
                  size={30}
                  color={theme === "dark" ? "#b8b8b8" : "#595959"}
                />
                <p className="text-black/80 dark:text-white/80  text-xl ">
                  {t("checkout.text3")}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <TbTruck
                  size={30}
                  color={theme === "dark" ? "#b8b8b8" : "#595959"}
                />
                <p className="text-black/80 text-xl dark:text-white/80  ">
                  {t("checkout.text4")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {!dataFetched ? (
          <div className="flex justify-center items-center h-[50vh]">
            <LoadingAnimationSmall />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row justify-center mt-10 ">
            <div className="w-screen lg:w-[35rem]  2xl:w-[40rem] px-10 md:px-16  xl:px-0 border-r-[1px] border-black/20 xl:pr-12">
              <p className="text-black/80 dark:text-white/80 text-3xl">
                1. {t("checkout.text5")}
              </p>

              {addresses.length !== 0 ? (
                <button
                  onClick={() => setShowAddressDiv(!showAddressDiv)}
                  className="border-[1px] border-black/80 dark:border-white/80 h-[3rem] w-full mt-6 hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <p className="text-xl text-black/80 dark:text-white/80">
                    {t("checkout.text6")}
                  </p>
                </button>
              ) : (
                !user && (
                  <>
                    <button
                      onClick={handleLoginClick}
                      className="border-[1px] border-black/80 dark:border-white/80 h-[3rem] w-full mt-6 hover:bg-black/10 dark:hover:bg-white/10"
                    >
                      <p className="text-xl text-black/80 dark:text-white/80">
                        {t("checkout.text7")}
                      </p>
                    </button>

                    <div className="flex items-center mt-8 space-x-2 justify-center">
                      <div className="h-[1px] bg-black/50 dark:bg-white/50 w-full"></div>
                      <p className="text-black/80 dark:text-white/80 whitespace-nowrap">
                        {t("checkout.text8")}
                      </p>
                      <div className="h-[1px] bg-black/50 dark:bg-white/50 w-full"></div>
                    </div>
                  </>
                )
              )}

              <div className="flex space-x-2 mt-8">
                {typeAddress.map((type, index) => (
                  <label key={index} className="cursor-pointer flex">
                    <input
                      type="radio"
                      className="peer sr-only"
                      name="typeAddress"
                      value={type}
                      onChange={handleTypeAddressChange}
                      checked={type === selectedTypeAddress}
                    />
                    <div className="w-5 h-5 border-2 border-black/80 dark:border-white/80 rounded-full transition-all peer-checked:bg-black/80 dark:peer-checked:bg-white"></div>
                    <p className="px-4 text-black/80 dark:text-white/80">
                      {t(`typeAddress.${type}`)}
                    </p>
                  </label>
                ))}
              </div>

              <InputCheckout
                placeholder={t("login.email")}
                extra="w-full"
                value={email}
                onChange={(value) => setEmail(value)}
                error={errors.email}
                handleBlur={handleBlur}
              />

              {selectedTypeAddress === "company" && (
                <InputCheckout
                  placeholder="Firma"
                  extra="w-full"
                  value={extra}
                  onChange={(value) => setExtra(value)}
                  error={""}
                  handleBlur={handleBlur}
                />
              )}

              <InputCheckout
                placeholder={t("login.name")}
                extra="w-full"
                value={name}
                onChange={(value) => setName(value)}
                error={errors.name}
                handleBlur={handleBlur}
              />
              <InputCheckout
                placeholder={t("login.surname")}
                extra="w-full"
                value={surname}
                onChange={(value) => setSurname(value)}
                error={errors.surname}
                handleBlur={handleBlur}
              />
              <InputCheckout
                placeholder={t("address.telephone")}
                extra="w-full"
                value={telephone}
                onChange={(value) => setTelephone(value)}
                error={errors.telephone}
                handleBlur={handleBlur}
              />
              <div className="w-full ">
                <InputCheckout
                  placeholder={t("address.street")}
                  extra="w-full"
                  value={street}
                  onChange={(value) => setStreet(value)}
                  error={errors.street}
                  handleBlur={handleBlur}
                />
              </div>
              <InputCheckout
                placeholder={t("address.postalCode")}
                extra="w-full"
                value={postalCode}
                onChange={(value) => setPostalCode(value)}
                error={errors.postalCode}
                handleBlur={handleBlur}
              />
              <InputCheckout
                placeholder={t("address.city")}
                extra="w-full"
                value={city}
                onChange={(value) => setCity(value)}
                error={errors.city}
                handleBlur={handleBlur}
              />
              <div className="relative">
                <button
                  onClick={() => setShowCountryDiv(!showCountryDiv)}
                  className="relative flex justify-between items-center border-[1px] px-4 border-black/30 dark:border-white/50 h-[3rem] w-full mt-6 hover:bg-black/10"
                >
                  <p className="text-lg text-black/80 dark:text-white/80">
                    {country === ""
                      ? t("address.country")
                      : t(`country.${country}`)}
                  </p>
                  {showCountryDiv ? (
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
                {showCountryDiv && (
                  <div className="absolute top-[3.2rem] left-0 border-[1px]  border-black/30  bg-white dark:bg-[#b8b8b8] w-full z-10">
                    {countries.map(({ code, name }) => (
                      <button
                        onClick={() => handleChangeCountry(name)}
                        key={code}
                        className="flex justify-start items-center px-4 py-2 w-full hover:bg-black/10"
                      >
                        <span className={`fi fi-${code} mr-2`}></span>
                        {t(`country.${name}`)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.country && (
                <p className="text-red-500 text-sm mt-1 ">{errors.country}</p>
              )}

              <p className="text-black/80 dark:text-white/80 text-3xl mt-10">
                2. {t("checkout.text10")}{" "}
              </p>

              {delivery.map((type, index) => (
                <label
                  key={index}
                  className="flex justify-between items-center mt-4"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center cursor-pointer ">
                      <input
                        type="radio"
                        className="peer sr-only"
                        name="delivery"
                        value={type.name}
                        onChange={handleDeliveryChange}
                        checked={
                          selectedDelivery &&
                          selectedDelivery.name === type.name
                        }
                      />
                      <div className="w-5 h-5 border-2 border-black/80 dark:border-white/80 rounded-full transition-all peer-checked:bg-black/80 dark:peer-checked:bg-white"></div>
                      <p className="px-4 text-black/80 dark:text-white/80 text-lg">
                        {type.name}
                      </p>
                    </div>

                    {selectedDelivery.name === type.name && (
                      <p className="text-black/50 dark:text-white/50 ml-9 mt-1 ">
                        {t("checkout.text11")} {type.deliveryTime}{" "}
                        {t("checkout.text12")}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-1 items-center">
                    <p
                      className={`px-4 text-black/80 dark:text-white/80 whitespace-nowrap  text-lg ${type.price === 0 ? "text-green-500" : "text-black/80"
                        }`}
                    >
                      {formatPrice(type.price, t)}
                    </p>

                    <LazyLoadImage
                      src={require("../../assets/images/" +
                        type.image +
                        ".jpg")}
                      alt="Logo firmy"
                      className="w-8"
                      effect="blur"
                      placeholderSrc={require("../../assets/images/" +
                        type.image +
                        ".jpg")}
                    />
                  </div>
                </label>
              ))}

              <p className="text-black/80 dark:text-white/80 text-3xl mt-10">
                3. {t("checkout.text13")}{" "}
              </p>

              {payment.map((type, index) => (
                <label
                  key={index}
                  className="flex justify-between items-center mt-4"
                >
                  <div className="flex items-center cursor-pointer ">
                    <input
                      type="radio"
                      className="peer sr-only"
                      name="payment"
                      value={type.name}
                      onChange={handlePaymentChange}
                      checked={type.name === selectedPayment.name}
                    />
                    <div className="w-5 h-5 border-2 border-black/80 dark:border-white/80 rounded-full transition-all peer-checked:bg-black/80 dark:peer-checked:bg-white"></div>
                    <p className="px-4 text-black/80 dark:text-white/80 text-lg">
                      {t(`payment.${type.name}`)}
                    </p>
                  </div>

                  <LazyLoadImage
                    src={require("../../assets/images/" + type.image + ".png")}
                    alt="Logo firmy"
                    className="w-8"
                    effect="blur"
                    placeholderSrc={require("../../assets/images/" +
                      type.image +
                      ".png")}
                  />
                </label>
              ))}
              {errorsChecked.payment && (
                <p className="text-red-500 text-sm mt-2  ">
                  {errorsChecked.payment}
                </p>
              )}
            </div>
            <div className="w-screen lg:w-[35rem] 2xl:w-[40rem] xl:pl-12 px-10 md:px-16 xl:px-0 mt-8 lg:mt-0">
              <p className="text-black/80 dark:text-white/80  text-3xl mb-10">
                4. {t("checkout.text14")}
              </p>
              <div className="flex flex-col">
                {shoes.map((product) => (
                  <div key={product._id}>
                    <CheckoutProductTemplate
                      imageUrl={product.imageUrl || ""}
                      brand={product.shoe.brand}
                      name={product.shoe.name}
                      cartSize={product.size}
                      cartQuantity={product.quantity}
                      price={product.shoe.price}
                    />
                  </div>
                ))}
              </div>

              <div className="h-[1px] w-full bg-black/20 mt-4"></div>

              <div className="flex flex-col w-full mt-6 space-y-4">
                <div className="flex justify-between text-xl text-black/80 dark:text-white/80">
                  <p>{t("checkout.text15")}</p>
                  <p className="font-bold">{formatPrice(totalPrice, t)}</p>
                </div>

                {discountAmount !== 0 && (
                  <div className="flex justify-between text-xl">
                    <p className="text-black/80 dark:text-white/80 ">
                      {t("checkout.text16")} {discountName}
                    </p>
                    <p className="text-red-500 font-bold ">
                      - {formatPrice(finalDiscount, t)}
                    </p>
                  </div>
                )}

                <div className="flex justify-between text-xl">
                  <p className="text-black/80 dark:text-white/80 ">
                    {t("checkout.text17")}
                  </p>
                  <p
                    className={`${selectedDelivery.price === 0
                      ? "text-green-500"
                      : "text-black/80 dark:text-white/80 "
                      } font-bold`}
                  >
                    {formatPrice(selectedDelivery.price, t)}
                  </p>
                </div>
              </div>

              <div className="h-[1px] w-full bg-black/20 mt-6"></div>

              <div className="flex justify-between text-xl mt-4 text-black/80 dark:text-white/80 font-bold">
                <p>{t("checkout.text18")}</p>
                <p>{formatPrice(priceAfterDiscount, t)}</p>
              </div>

              <div className="flex justify-center items-center space-x-4 mt-6">
                <input
                  type="checkbox"
                  onChange={handleTermsChange}
                  className="w-5 h-5 checked:bg-blue-500 cursor-pointer "
                />
                <p className="w-[100%] text-base text-black dark:text-white mt-4">
                  {t("checkout.text19")} *
                </p>
              </div>
              {errorsChecked.terms && (
                <p className="text-red-500 text-sm mt-2 ">
                  {errorsChecked.terms}
                </p>
              )}

              <button
                disabled={showLoading}
                onClick={handleSubmit}
                className="w-full h-[3.5rem] rounded-md bg-[#97DEFF] disabled:bg-[#c9c9c9] mt-6 hover:bg-[#48c5ff]"
              >
                <div className="flex items-center justify-center">
                  {showLoading && <CircleSvg color="black" secColor="black" />}
                  <p className="text-xl text-black/80">
                    {t("checkout.text20")}
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Checkout;
