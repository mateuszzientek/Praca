import React, { useContext } from "react";
import { FaCheck } from "react-icons/fa";
import { ThemeContext } from "../elements/ThemeContext";
import { useTranslation } from "react-i18next";
import { AddressInterface } from "src/types";


interface AddressTemplateProps {
  name: string;
  surname: string;
  street: string;
  city: string;
  postalCode: string;
  telephone: string;
  extra: string;
  country: string
  addressId: string;
  isDefault: boolean;
  onDelete: (addressId: string) => void;
  onDefaultChange: (addressId: string) => void
  setShowDiv: (showDiv: boolean) => void;
  onEditClick: (address: AddressInterface) => void;
}

function AddressTemplate(props: AddressTemplateProps) {

  const currentCode = localStorage.getItem('i18nextLng')
  const { t } = useTranslation();
  const { theme, setTheme } = useContext(ThemeContext);

  const handleDeleteClick = () => {
    props.onDelete(props.addressId); // Pass the addressId to onDelete
  };

  const handleDefaultClick = () => {
    props.onDefaultChange(props.addressId); // Pass the addressId to onDelete
  };

  const handleShowEdit = () => {
    props.setShowDiv(true);
    props.onEditClick({
      _id: props.addressId,
      name: props.name,
      surname: props.surname,
      street: props.street,
      city: props.city,
      postalCode: props.postalCode,
      telephone: props.telephone,
      extra: props.extra,
      country: props.country,
      isDefault: props.isDefault,
    });
  };

  return (

    <div
      className={`relative w-[25rem] h-[16rem]  ${props.isDefault
        ? "border-black dark:border-white border-2"
        : "border-black/30 dark:border-white/30 border-[1px]"
        }  `}
    >
      {props.isDefault && (
        <FaCheck
          className="absolute right-6 top-6"
          size={30}
          color={theme === "dark" ? "white" : "black"}
        />
      )}

      <div className="ml-6 mt-6 text-lg text-black/80 dark:text-white/80">
        <p className="font-bold mb-2">
          {" "}
          {props.name.charAt(0).toUpperCase() + props.name.slice(1)}{" "}
          {props.surname.charAt(0).toUpperCase() + props.surname.slice(1)}
        </p>

        <p>{props.street.toUpperCase()}</p>
        <p>
          {" "}
          {props.city.toUpperCase()}, {props.postalCode}, {t(`country.${props.country}`).toUpperCase()}
        </p>
        <p> {props.telephone}</p>

        <p> {props.extra}</p>

        <div className="flex text-base absolute bottom-4 items-center">
          <button onClick={handleShowEdit} className="h-[2rem] border-b-2 border-black/80 dark:border-white/80 dark:text-white/80 hover:bg-black/80 hover:dark:bg-white/80 hover:dark:text-black hover:text-white">
            {t("profile.edit")}
          </button>

          <button
            onClick={handleDeleteClick}
            className="ml-4 h-[2rem] border-b-2 border-black/80 dark:border-white/80 dark:text-white/80 hover:bg-black/80 hover:dark:bg-white/80 hover:dark:text-black hover:text-white"
          >
            {t("profile.delete")}
          </button>
          {props.isDefault ? (
            <p className={`${currentCode === "pl" ? " ml-44" : "ml-48"}  font-bold`}> {t("address.default")}</p>
          ) : (
            <button onClick={handleDefaultClick} className={`${currentCode === "pl" ? " ml-28" : "ml-40"} h-[2rem] border-b-2 border-black/80 dark:border-white/80 dark:text-white/80 hover:bg-black/80 hover:dark:bg-white/80 hover:dark:text-black hover:text-white`}>
              {t("address.setDefault")}
            </button>
          )}
        </div>
      </div>
    </div>

  );
}

export default AddressTemplate;
