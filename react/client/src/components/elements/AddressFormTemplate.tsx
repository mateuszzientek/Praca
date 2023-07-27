import React, { useContext, useState } from 'react'
import { AiOutlineClose } from "react-icons/ai";
import { ThemeContext } from "../elements/ThemeContext";
import { useTranslation } from "react-i18next";
import CircleSvg from "../elements/CircleSvg";

interface Address {
    _id: string;
    name: string;
    surname: string;
    street: string;
    city: string;
    postalCode: string;
    telephone: string;
    extra: string;
    isDefault: boolean;
}

interface AddressFormTemplateProps {
    text: string
    name: string
    surname: string;
    street: string;
    city: string;
    postalCode: string;
    telephone: string;
    extra: string;
    addressId: string;
    isDefault: boolean;
    isLoading: boolean
    setShowDiv: () => void;
    onSubmit: (address: Address) => void;
}

function AddressFormTemplate(props: AddressFormTemplateProps) {

    const { t } = useTranslation();
    const { theme, setTheme } = useContext(ThemeContext);

    const capitalizeFirstLetter = (str: string) => { return str.charAt(0).toUpperCase() + str.slice(1); };

    const [name, setName] = useState(props.name ? capitalizeFirstLetter(props.name) : "");
    const [surname, setSurname] = useState(props.surname ? capitalizeFirstLetter(props.surname) : "");
    const [street, setStreet] = useState(props.street ? capitalizeFirstLetter(props.street) : "");
    const [city, setCity] = useState(props.city ? capitalizeFirstLetter(props.city) : "");
    const [postalCode, setPostalCode] = useState(props.postalCode ? props.postalCode : "");
    const [telephone, setTelephone] = useState(props.telephone ? props.telephone : "");
    const [extra, setExtra] = useState(props.extra ? props.extra : "");
    const [errors, setErrors] = useState({
        name: "",
        surname: "",
        street: "",
        city: "",
        postalCode: "",
        telephone: "",
    });


    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updated = event.target.value;
        const capitalized =
            updated.charAt(0).toUpperCase() + updated.slice(1);
        setName(capitalized);
    };

    const handleSurnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updated = event.target.value;
        const capitalized =
            updated.charAt(0).toUpperCase() + updated.slice(1);
        setSurname(capitalized);
    };

    const handleStreetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updated = event.target.value;
        const capitalized =
            updated.charAt(0).toUpperCase() + updated.slice(1);
        setStreet(capitalized);
    };

    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updated = event.target.value;
        const capitalized =
            updated.charAt(0).toUpperCase() + updated.slice(1);
        setCity(capitalized);
    };

    const handlePostalCodeChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPostalCode(event.target.value);
    };

    const handleTelephoneChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setTelephone(event.target.value);
    };

    const handleExtraChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExtra(event.target.value);
    };

    const validateData = () => {
        const newErrors = {
            name: "",
            surname: "",
            street: "",
            city: "",
            postalCode: "",
            telephone: "",
        };

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

    const handleClickSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isValid = validateData();

        if (!name || !surname || !street || !city || !postalCode || !telephone) {
            // Przynajmniej jedno z pól jest puste
            setErrors({
                name: !name ? t("loginError.nameReq") : "",
                surname: !surname ? t("loginError.surnameReq") : "",
                street: !street ? t("address.streetReq") : "",
                city: !city ? t("address.cityReq") : "",
                postalCode: !postalCode ? t("address.postalCodeReq") : "",
                telephone: !telephone ? t("address.telephoneReq") : "",
            });
            return; // Zwracamy funkcję, jeśli którekolwiek pole jest puste
        }

        if (isValid) {

            const editedAddress: Address = {
                name,
                surname,
                street,
                city,
                postalCode,
                telephone,
                extra,
                _id: props.addressId,
                isDefault: props.isDefault,
            };

            props.onSubmit(editedAddress);
        };
    }


    return (
        <div className="bg-black/80 fixed w-full h-screen z-10 flex justify-center items-center ">
            <div className="relative flex flex-col items-start pl-10 pb-10 bg-white dark:bg-black dark:border-white dark:border-2 w-[25rem]  lg:w-[35rem]  xl:w-[45rem]  rounded-lg">
                <div onClick={props.setShowDiv}>
                    <AiOutlineClose
                        size={30}
                        color={theme === "dark" ? "white" : "black"}
                        className="absolute right-8 top-6 cursor-pointer hover:scale-125"
                    />
                </div>

                <p className="text-3xl text-black/80 dark:text-white/80 font-bold mt-6">
                    {props.text}
                </p>

                <form className="w-[90%]" onSubmit={handleClickSubmit} >
                    <div className="flex mt-10 space-x-4">
                        <div className="w-[50%]">
                            <input
                                className={` w-full px-2 h-[3rem] border-2 border-black/50 `}
                                placeholder={t("login.name") as string}
                                onChange={handleNameChange}
                                value={name}
                                onBlur={handleBlur}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1 ml-3">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="w-[50%]">
                            <input
                                className={`w-full px-2 h-[3rem] border-2 border-black/50 `}
                                placeholder={t("login.surname") as string}
                                onChange={handleSurnameChange}
                                value={surname}
                                onBlur={handleBlur}
                            />
                            {errors.surname && (
                                <p className="text-red-500 text-sm mt-1 ml-3">
                                    {errors.surname}
                                </p>
                            )}
                        </div>
                    </div>
                    <input
                        className={`mt-6 px-2 w-full h-[3rem] border-2 border-black/50 `}
                        placeholder={t("address.street") as string}
                        onChange={handleStreetChange}
                        value={street}
                        onBlur={handleBlur}
                    />
                    <p
                        className={`text-sm ml-3 mt-1 ${errors.street
                            ? "text-red-500"
                            : "text-black/50 dark:text-white/50"
                            }`}
                    >
                        {errors.street ? errors.street : t("address.text1")}
                    </p>

                    <input
                        className={`mt-6 px-2 w-full h-[3rem] border-2 border-black/50 `}
                        placeholder={t("address.extra") as string}
                        onChange={handleExtraChange}
                        value={extra}
                        onBlur={handleBlur}
                    />

                    <p className="text-sm text-black/50 dark:text-white/50  ml-3 mt-1">
                        {t("address.text2")}
                    </p>

                    <div className="flex space-x-4 ">
                        <div className="w-full">
                            <input
                                className={`mt-6 w-full px-2 h-[3rem] border-2 border-black/50 `}
                                placeholder={t("address.postalCode") as string}
                                onChange={handlePostalCodeChange}
                                value={postalCode}
                                onBlur={handleBlur}
                            />

                            <p
                                className={`text-sm ml-3 mt-1 ${errors.postalCode
                                    ? "text-red-500"
                                    : "text-black/50 dark:text-white/50"
                                    }`}
                            >
                                {errors.postalCode ? errors.postalCode : t("address.text3")}
                            </p>
                        </div>
                        <div className="w-full">
                            <input
                                className={`mt-6 w-full  px-2 h-[3rem] border-2 border-black/50 `}
                                placeholder={t("address.city") as string}
                                onChange={handleCityChange}
                                value={city}
                                onBlur={handleBlur}
                            />

                            <p
                                className={`text-sm ml-3 mt-1 ${errors.city
                                    ? "text-red-500"
                                    : "text-black/50 dark:text-white/50"
                                    }`}
                            >
                                {errors.city ? errors.city : t("address.text4")}
                            </p>
                        </div>
                    </div>
                    <input
                        className={`mt-6 w-[49%]  px-2 h-[3rem] border-2 border-black/50 `}
                        placeholder={t("address.telephone") as string}
                        onChange={handleTelephoneChange}
                        value={telephone}
                        onBlur={handleBlur}
                    />
                    <p
                        className={`text-sm ml-3 mt-1 ${errors.telephone
                            ? "text-red-500"
                            : "text-black/50 dark:text-white/50"
                            }`}
                    >
                        {errors.telephone ? errors.telephone : t("address.text5")}
                    </p>

                    <button
                        type="submit"
                        className={`mt-6 w-full px-2 h-[3rem] dark:bg-white/50 bg-black/80 hover:scale-105 ease-in-out duration-300`}
                    >
                        <div className="flex items-center justify-center">
                            {props.isLoading && <CircleSvg color="white" secColor="white" />}
                            <p className="text-xl  text-white/80  ">{t("profile.save")}</p>
                        </div>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddressFormTemplate;