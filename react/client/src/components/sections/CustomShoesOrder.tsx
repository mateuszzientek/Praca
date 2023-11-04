import React, { useContext, useEffect, useState } from 'react';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import logo from "../../assets/images/logo.png";
import { TbTruckReturn, TbTruck } from "react-icons/tb";
import { AiOutlineDown, AiOutlineUp, AiOutlineClose } from "react-icons/ai";
import logo2 from "../../assets/images/logo-black.png";
import { ThemeContext } from "../elements/ThemeContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../elements/UserProvider";
import { ErrorInterface, AddressInterface, ProductInterface, ProjectItem } from "src/types";
import axios from "axios";
import validator from "validator";
import InputCheckout from "../elements/InputCheckout";
import { formatPrice } from "src/currencyUtils";
import InfoDivBottom from "../elements/InfoDivBottom";
import AddressTemplateCheckout from "../elements/AddressTemplateCheckout";
import LeftViewDesignShoe from "../sections/LeftViewDesignShoe";

interface Address extends AddressInterface {
    email: string;
}

interface CustomShoesOrderProps {
    setShowMainDiv: (state: boolean) => void
    project: ProjectItem | null;
    size: string
}

function CustomShoesOrder(props: CustomShoesOrderProps) {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const { theme, setTheme } = useContext(ThemeContext);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const { user, isUserLoggedIn } = useContext(UserContext);
    const [dataFetched, setDataFetched] = useState(true);
    const [errorsServer, setErrorsServer] = useState("");
    const [showCountryDiv, setShowCountryDiv] = useState(false);
    const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
    const [showAddressDiv, setShowAddressDiv] = useState(false);
    const [selectedTypeAddress, setSelectedTypeAddress] = useState("individual");
    const [selectedPayment, setSelectedPayment] = useState({ name: "" });
    const [terms, setTerms] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState({
        name: "Kurier Inpost",
        price: 0,
    });
    const [errorsValidationServer, setErrorsValidationServer] = useState<
        ErrorInterface[]
    >([]);

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [telephone, setTelephone] = useState("");
    const [extra, setExtra] = useState("");
    const [country, setCountry] = useState("");

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

    const handleChangeCountry = (name: string) => {
        setCountry(name);
        setShowCountryDiv(false);
    };


    const handleTypeAddressChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSelectedTypeAddress(event.target.value);
    };

    const handleTermsChange = () => {
        setTerms(!terms);
        setErrorsChecked((prevErrorsChecked) => ({
            ...prevErrorsChecked,
            terms: "", // Zmieniamy na pusty ciąg znaków
        }));
    };

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

    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };


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

    return (
        <>
            {errorsServer && (
                <div className="flex justify-center">
                    <InfoDivBottom color="bg-red-500" text={errorsServer} />
                </div>
            )}

            {errorsValidationServer.length > 0 && (
                <InfoDivBottom
                    color="bg-red-500"
                    text={errorsValidationServer.map((error) => error.msg).join(", ")}
                />
            )}

            {showAddressDiv && (
                <div className="fixed bg-black/40 w-full h-screen z-[70] flex justify-center items-center backdrop-blur-sm overflow-y-auto min-h-screen">
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

            <div className='fixed w-screen h-screen z-50 bg-white dark:bg-[#292929] overflow-y-auto overflow-x-hidden'>
                <button
                    onClick={() => props.setShowMainDiv(false)}
                    className="absolute top-[2rem] left-[2rem] px-6 py-3 text-black  dark:text-white rounded-full border-2 border-black/60 dark:border-white/70 hover:bg-black/80 hover:text-white hover:dark:text-black hover:dark:bg-white "
                >
                    <p className="text-lg"> {t("designSection.text1")}</p>
                </button>
                <div
                    className={`flex justify-center w-screen  items-center h-32  md:px-20 mx-auto pt-1 border-b-[1px] border-black/20`}
                >
                    <div className="flex items-center justify-center  lg:space-x-[10rem] xl:space-x-[25rem] 2xl:space-x-[45rem] w-[90rem]  h-full">
                        <div className="flex items-center space-x-6 xl:space-x-10">
                            <LazyLoadImage
                                onClick={() => navigate("/")}
                                src={theme === "dark" ? logo2 : logo}
                                alt="Logo firmy"
                                className="dark:h-20 h-16 w-48 -rotate-6 cursor-pointer"
                                effect="blur"
                                placeholderSrc={theme === "dark" ? logo2 : logo}
                            />


                        </div>

                        <div className="hidden lg:flex items-center space-x-10">
                            <div className="flex items-center space-x-2">
                                <TbTruckReturn
                                    size={30}
                                    color={theme === "dark" ? "#b8b8b8" : "#595959"}
                                />
                                <p className="text-black/80 dark:text-white/80  text-xl ">
                                    {t("Brak zwrotu")}
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

                <div className="flex flex-col lg:flex-row justify-center mt-10 pb-20">
                    <div className="w-screen lg:w-[35rem]  2xl:w-[40rem] px-10 md:px-16  xl:px-0 border-r-[1px] border-black/20 xl:pr-12">
                        <p className="text-black/80 dark:text-white/80 text-3xl">
                            1. {t("checkout.text5")}
                        </p>

                        {addresses.length !== 0 && (
                            <button
                                onClick={() => setShowAddressDiv(!showAddressDiv)}
                                className="border-[1px] border-black/80 dark:border-white/80 h-[3rem] w-full mt-6 hover:bg-black/10 dark:hover:bg-white/10"
                            >
                                <p className="text-xl text-black/80 dark:text-white/80">
                                    {t("checkout.text6")}
                                </p>
                            </button>
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
                        <p className="text-black/80 dark:text-white/80  text-3xl ">
                            4. {t("checkout.text14")}
                        </p>
                        {props.project && (
                            <div className='py-6 relative flex flex-col md:flex-row lg:flex-col xl:flex-row justify-left items-center'>
                                <div className='transform scale-[90%]'>
                                    <LeftViewDesignShoe
                                        isLeftSwooshVisible={
                                            props.project.swooshVisibility.isLeftSwooshVisible
                                        }
                                        leftText={props.project.sideText.leftText}
                                        selectedLeftPatch={
                                            props.project.selectedPatches.selectedLeftPatch
                                        }
                                        selectedColors={props.project.selectedColors}
                                        selectedColorsText={props.project.selectedColorsText}
                                        designName={props.project.designName}
                                        setError={setErrorsServer}
                                    />
                                </div>
                                <div className=' text-left'>
                                    <p className="text-xl text-black/80 dark:text-white/90 ">
                                        {t("customization.text1")}
                                    </p>
                                    <p className="text-lg text-black/50 dark:text-white/60 mt-4">
                                        {" "}
                                        {t("customization.text2")}
                                    </p>

                                    <div className='flex justify-left  items-center mt-3 space-x-4 '>
                                        <p className='text-lg text-black/60 dark:text-white/60 '>{t("checkout.text21")} <span className='text-black  dark:text-white'>{t(`sizes.${props.size}`)}</span></p>
                                        <p className='text-lg text-black/60 dark:text-white/60 '>{t("checkout.text22")} <span className='text-black dark:text-white'>1</span></p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="h-[1px] w-full bg-black/20 mt-4"></div>

                        <div className="flex flex-col w-full mt-6 space-y-4">
                            <div className="flex justify-between text-xl text-black/80 dark:text-white/80">
                                <p>{t("checkout.text15")}</p>
                                <p className="font-bold">{formatPrice(115, t)}</p>
                            </div>

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
                            <p>{formatPrice(115 + selectedDelivery.price, t)}</p>
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

                        <button
                            // disabled={showLoading}
                            // onClick={handleSubmit}
                            className="w-full h-[3.5rem] rounded-md bg-[#97DEFF] disabled:bg-[#c9c9c9] mt-6 hover:bg-[#48c5ff]"
                        >
                            <div className="flex items-center justify-center">
                                {/* {showLoading && <CircleSvg color="black" secColor="black" />} */}
                                <p className="text-xl text-black/80">
                                    {t("checkout.text20")}
                                </p>
                            </div>
                        </button>
                    </div>
                </div>

            </div>
        </>
    );
}

export default CustomShoesOrder;