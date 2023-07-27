import React, { useContext, useState, useEffect, useRef } from "react";
import Navbar from "../sections/Navbar";
import address_light from "../../assets/images/address.png";
import address_dark from "../../assets/images/address_dark.png";
import { ThemeContext } from "../elements/ThemeContext";
import { UserContext } from "../elements/UserProvider";
import { AiOutlinePlus } from "react-icons/ai";
import LoadingAnimationSmall from "../elements/LoadingAnimatonSmall";
import axios from "axios";
import CircleSvg from "../elements/CircleSvg";
import InfoDivBottom from "../elements/InfoDivBottom";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AddressTemplate from "../elements/AddressTemplate";
import AddressFormTemplate from "../elements/AddressFormTemplate";

interface Error {
  msg: string;
  type: string;
  value: string;
  path: string;
  location: string;
}

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

function Address() {

  const { t } = useTranslation();
  const { user, isUserDataLoaded, fetchUserData } =
    useContext(UserContext);
  const { theme, setTheme } = useContext(ThemeContext);

  const [openEditDiv, setOpenEditDiv] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [singleAddress, setSingleAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [openDiv, setOpenDiv] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorsVadlidationServer, setErrorsVadlidationServer] = useState<
    Error[]
  >([]);
  const [errorsServer, setErrorsServer] = useState("");

  const handleOpenEditDiv = () => {
    setOpenEditDiv(!openEditDiv)
  };

  const handleOpenDiv = (addressId: string) => {
    setOpenDiv(true);
    setSelectedAddressId(addressId);
  };

  const handleCloseDiv = () => {
    setOpenDiv(!openDiv);
    setSelectedAddressId("");
  };

  const handleClickAdd = () => {
    setShowAdd(!showAdd);
    setErrorsServer("");
    setErrorsVadlidationServer([]);
  };

  const sortedAddresses = addresses.slice().sort((a, b) => {
    if (a.isDefault && !b.isDefault) {
      return -1;
    } else if (!a.isDefault && b.isDefault) {
      return 1;
    } else {
      return 0;
    }
  });

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (isUserDataLoaded) {
      axios
        .get(`/getAddresses/?userId=${user?._id}`)
        .then((response) => {
          setAddresses(response.data.addresses);
          setIsDataFetched(true);
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
    }
  }, [user]);


  const handleClickSubmit = (address: Address) => {

    const data = {
      userId: user?._id,
      name: address.name,
      surname: address.surname,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      telephone: address.telephone,
      extra: address.extra,
    };

    setIsLoading(true);

    axios
      .post("/saveAddress", data)
      .then((response) => {
        const message = t("address.text6")
        setMessage(message);

        setAddresses((prevAddresses) =>
          prevAddresses.map((address) => ({
            ...address,
            isDefault: false,
          }))
        );

        setAddresses((prevAddresses) => [
          ...prevAddresses,
          { ...response.data.address, isDefault: true },
        ]);

        handleClickAdd();
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
        setIsLoading(false);
      });

  };

  const handleDeleteAddress = () => {
    setIsLoading(true);
    axios
      .delete(`/deleteAddress/${selectedAddressId}`)
      .then((response) => {
        const message = t("address.text7")
        setMessage(message);
        setAddresses((prevAddresses) =>
          prevAddresses.filter((address) => address._id !== selectedAddressId)
        );
        setOpenDiv(false);
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
        setIsLoading(false);
      });
  };

  const handleChangeDefault = (addressId: string) => {

    axios.post("/changeDefaultAddress", { addressId: addressId, userId: user?._id })
      .then((response) => {
        setAddresses((prevAddresses) =>
          prevAddresses.map((address) => ({
            ...address,
            isDefault: address._id === addressId,
          }))
        );
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
  }

  const handleEditClick = (address: Address) => {
    setSingleAddress(address);
  };

  const handleEditAddress = (address: Address) => {

    const data = {
      addressId: address._id,
      name: address.name,
      surname: address.surname,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      telephone: address.telephone,
      extra: address.extra,
      isDefault: address.isDefault
    };

    setIsLoading(true);

    axios.post("/editAddress", data)
      .then((response) => {
        const updatedAddresses = addresses.map((addr) =>
          addr._id === address._id ? { ...addr, ...data } : addr
        );
        setAddresses(updatedAddresses);
        const message = t("address.text8")
        setMessage(message);
        setOpenEditDiv(false)
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
      }).finally(() => {
        setIsLoading(false);
      });

  }

  return (
    <>
      {openEditDiv && singleAddress &&
        <AddressFormTemplate
          text={t("address.text9")}
          setShowDiv={handleOpenEditDiv}
          addressId={singleAddress._id}
          name={singleAddress?.name}
          surname={singleAddress?.surname}
          street={singleAddress?.street}
          city={singleAddress?.city}
          postalCode={singleAddress?.postalCode}
          telephone={singleAddress?.telephone}
          extra={singleAddress?.extra}
          isDefault={singleAddress.isDefault}
          isLoading={isLoading}
          onSubmit={handleEditAddress}
        />}

      {showAdd && (
        <AddressFormTemplate
          text={t("address.text10")}
          setShowDiv={handleClickAdd}
          addressId={""}
          name={""}
          surname={""}
          street={""}
          city={""}
          postalCode={""}
          telephone={""}
          extra={""}
          isDefault={false}
          isLoading={isLoading}
          onSubmit={handleClickSubmit}
        />
      )}

      {openDiv && (
        <div className="bg-black/80 fixed w-full h-screen z-10 flex justify-center items-center ">
          <div className="relative flex flex-col items-start pl-10 pb-10 bg-white dark:bg-black dark:border-white dark:border-2 w-[25rem] xl:w-[38rem]  rounded-lg">
            <p className="text-3xl  text-black/80 dark:text-white/80 font-bold mt-6">
              {t("address.text11")}
            </p>

            <button
              onClick={handleDeleteAddress}
              className={`mt-10 w-[90%] h-[3rem] dark:bg-white/50 bg-black/80 hover:scale-105 ease-in-out duration-300`}
            >
              <div className="flex items-center justify-center">
                {isLoading && <CircleSvg color="white" secColor="white" />}
                <p className="text-xl  text-white/80  "> {t("profile.delete")}</p>
              </div>
            </button>

            <button
              onClick={handleCloseDiv}
              className={`mt-6 w-[90%] h-[3rem] border-2 border-black/80 dark:border-white/80 hover:scale-105 ease-in-out duration-300`}
            >
              <div className="flex items-center justify-center">
                <p className="text-xl text-black/80 dark:text-white/80 ">
                  {t("profile.cancel")}
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      <div className="bg-black/10 dark:bg-black/80 pb-20 min-h-screen ">
        <Navbar
          background="bg-white"
          shadow="none"
          extra="border-b border-black/20 dark:border-white/20"
        />

        <div className="flex justify-center items-center bg-white dark:bg-[#292929] h-[13rem]">
          {errorsServer ||
            (errorsVadlidationServer.length > 0 && (
              <InfoDivBottom
                color="bg-red-500"
                text={
                  errorsServer
                    ? errorsServer
                    : errorsVadlidationServer
                      .map((error) => error.msg)
                      .join(", ")
                }
              />
            ))}

          {message && <InfoDivBottom color="bg-green-500" text={message} />}

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
                {t("address.text12")}
              </p>
            </div>

            <div className="flex items-center space-x-2 lg:mt-40">
              <Link
                to={"/profile"}
                className="text-xl lg:text-2xl  text-black/50 dark:text-white/50  hover:border-b-4  hover:border-black hover:dark:border-white px-4 h-[3rem]  cursor-pointer"
              >
                {t("profile.myprofile")}
              </Link>
              <a className="text-xl lg:text-2xl text-black/80 dark:text-white/80 px-4 h-[3rem]  border-b-4  border-black dark:border-white cursor-default ">
                {t("profile.address")}
              </a>
              <a className="text-xl lg:text-2xl text-black/50 dark:text-white/50  px-4 h-[3rem] hover:border-b-4  hover:border-black hover:dark:border-white cursor-pointer">
                {t("profile.orders")}
              </a>
            </div>

            <img
              src={theme === "dark" ? address_dark : address_light}
              className="hidden lg:block h-[7rem] w-[7rem] absolute right-14 xl:right-0 bottom-0"
            />
          </div>
        </div>

        {!isDataFetched ? (
          <div className="flex justify-center items-center h-[50vh]">
            <LoadingAnimationSmall />
          </div>
        ) : (
          <div className="flex flex-col items-center mx-auto pr-10 bg-white dark:bg-[#292929] w-full lg:w-[1000px] py-10 mt-20 pl-6 md:pl-10">
            <p className="text-2xl text-center text-black dark:text-white mb-10">
              {t("address.text13")}
            </p>
            <div className="flex flex-wrap justify-center w-full mx-auto gap-6 gap-y-6 ">
              <button
                onClick={handleClickAdd}
                className="relative w-[25rem] h-[15rem] border-[1px] border-black/30 dark:border-white/30 hover:scale-105 ease-in-out duration-300"
              >
                <p className="absolute left-6 top-6 text-black dark:text-white">
                  {t("address.text14")}
                </p>
                <AiOutlinePlus
                  className="absolute left-6 bottom-6"
                  size={30}
                  color={theme === "dark" ? "white" : "black"}
                />
              </button>
              {sortedAddresses.map((address) => (
                <div key={address._id}>
                  <AddressTemplate
                    name={address.name}
                    surname={address.surname}
                    street={address.street}
                    city={address.city}
                    postalCode={address.postalCode}
                    telephone={address.telephone}
                    extra={address.extra}
                    isDefault={address.isDefault}
                    onDelete={handleOpenDiv}
                    setShowDiv={setOpenEditDiv}
                    onEditClick={handleEditClick}
                    onDefaultChange={handleChangeDefault}
                    addressId={address._id}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Address;
