import React, { useContext, useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { ThemeContext } from "../elements/ThemeContext";
import { useTranslation } from "react-i18next";
import CircleSvg from "../elements/CircleSvg";
import { AddressInterface } from "src/types";

interface AddressFormTemplateProps {
  text: string;
  name: string;
  surname: string;
  street: string;
  city: string;
  postalCode: string;
  telephone: string;
  extra: string;
  country: string;
  addressId: string;
  isDefault: boolean;
  isLoading: boolean;
  setShowDiv: () => void;
  onSubmit: (address: AddressInterface) => void;
  isOpen: boolean;
}

function AddressFormTemplate(props: AddressFormTemplateProps) {
  const { t } = useTranslation();
  const { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (props.isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up the effect
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [props.isOpen]);

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const [name, setName] = useState(
    props.name ? capitalizeFirstLetter(props.name) : ""
  );
  const [surname, setSurname] = useState(
    props.surname ? capitalizeFirstLetter(props.surname) : ""
  );
  const [street, setStreet] = useState(
    props.street ? capitalizeFirstLetter(props.street) : ""
  );
  const [city, setCity] = useState(
    props.city ? capitalizeFirstLetter(props.city) : ""
  );
  const [postalCode, setPostalCode] = useState(
    props.postalCode ? props.postalCode : ""
  );
  const [telephone, setTelephone] = useState(
    props.telephone ? props.telephone : ""
  );
  const [extra, setExtra] = useState(props.extra ? props.extra : "");
  const [country, setCountry] = useState(props.country ? props.country : "");
  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    street: "",
    city: "",
    postalCode: "",
    telephone: "",
    country: "",
  });

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

  const [showCountryDiv, setShowCountryDiv] = useState(false);

  const handleChangeCountry = (name: string) => {
    setCountry(name);
    setShowCountryDiv(false);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updated = event.target.value;
    const capitalized = updated.charAt(0).toUpperCase() + updated.slice(1);
    setName(capitalized);
  };

  const handleSurnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updated = event.target.value;
    const capitalized = updated.charAt(0).toUpperCase() + updated.slice(1);
    setSurname(capitalized);
  };

  const handleStreetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updated = event.target.value;
    const capitalized = updated.charAt(0).toUpperCase() + updated.slice(1);
    setStreet(capitalized);
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updated = event.target.value;
    const capitalized = updated.charAt(0).toUpperCase() + updated.slice(1);
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
      country: "",
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

    if (
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
        name: !name ? t("loginError.nameReq") : "",
        surname: !surname ? t("loginError.surnameReq") : "",
        street: !street ? t("address.streetReq") : "",
        city: !city ? t("address.cityReq") : "",
        postalCode: !postalCode ? t("address.postalCodeReq") : "",
        telephone: !telephone ? t("address.telephoneReq") : "",
        country: !country ? t("address.countryReq") : "",
      });
      return; // Zwracamy funkcję, jeśli którekolwiek pole jest puste
    }

    if (isValid) {
      const editedAddress: AddressInterface = {
        name,
        surname,
        street,
        city,
        postalCode,
        telephone,
        extra,
        country,
        _id: props.addressId,
        isDefault: props.isDefault,
      };

      props.onSubmit(editedAddress);
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm fixed w-full h-screen z-10 flex justify-center items-center min-h-screen overflow-y-auto">
      <div className="relative flex flex-col items-start px-10 pb-10 bg-white dark:bg-black max-h-[80vh] xl:max-h-[95vh] w-[25rem]  sm:w-[35rem]  md:w-[45rem] xl:w-[50rem]  rounded-lg overflow-y-auto">
        <div className="max-h-[80vh] xl:max-h-[95vh] w-full">
          <div className="flex justify-between items-center mt-6">
            <p className="text-3xl text-black/80 dark:text-white/80 font-bold ">
              {props.text}
            </p>
            <div onClick={props.setShowDiv}>
              <AiOutlineClose
                size={30}
                color={theme === "dark" ? "white" : "black"}
                className="cursor-pointer hover:scale-125"
              />
            </div>
          </div>

          <form className="w-full" onSubmit={handleClickSubmit}>
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
              className={`text-sm ml-3 mt-1 ${
                errors.street
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
                  className={`text-sm ml-3 mt-1 ${
                    errors.postalCode
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
                  className={`text-sm ml-3 mt-1 ${
                    errors.city
                      ? "text-red-500"
                      : "text-black/50 dark:text-white/50"
                  }`}
                >
                  {errors.city ? errors.city : t("address.text4")}
                </p>
              </div>
            </div>
            <input
              className={`mt-6 w-[100%]  px-2 h-[3rem] border-2 border-black/50 `}
              placeholder={t("address.telephone") as string}
              onChange={handleTelephoneChange}
              value={telephone}
              onBlur={handleBlur}
            />
            <p
              className={`text-sm ml-3 mt-1 ${
                errors.telephone
                  ? "text-red-500"
                  : "text-black/50 dark:text-white/50"
              }`}
            >
              {errors.telephone ? errors.telephone : t("address.text5")}
            </p>

            <div className="relative">
              <button
                type="button"
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
              <p className="text-red-500 text-sm mt-1 ml-3">{errors.country}</p>
            )}

            <button
              disabled={props.isLoading}
              type="submit"
              className={`my-6 w-full px-2 h-[3rem] dark:bg-white/50 bg-black/80 hover:scale-105 ease-in-out duration-300`}
            >
              <div className="flex items-center justify-center">
                {props.isLoading && (
                  <CircleSvg color="white" secColor="white" />
                )}
                <p className="text-xl  text-white/80  ">{t("profile.save")}</p>
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddressFormTemplate;
