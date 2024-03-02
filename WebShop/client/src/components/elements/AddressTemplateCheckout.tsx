import React from 'react';
import { useTranslation } from "react-i18next";

interface AddressTemplateCheckoutProps {
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
    handleSetDefaultAddress: (addressId: string) => void;
}

function AddressTemplateCheckout(props: AddressTemplateCheckoutProps) {

    const { t } = useTranslation();

    const handleAddressClick = () => {
        props.handleSetDefaultAddress(props.addressId);
    };

    return (
        <div onClick={handleAddressClick} className={`${props.isDefault ? "border-[1px] border-black/50 dark:border-white/50 rounded-lg" : ""} cursor-pointer hover:border-[1px] border-black/50 dark:border-white/50 rounded-lg mb-6`}>
            <div className="p-2 text-lg text-black/80 dark:text-white/80">
                <div className='flex items-center text-lg space-x-2 font-lato'>
                    <p className='text-base text-black/50 dark:text-white/50'>{t("checkout.text23")} </p>
                    <p >
                        {props.name}{" "}
                        {props.surname}
                    </p>

                </div>

                <div className='flex items-center text-lg space-x-2 font-lato'>
                    <p className='text-base text-black/50 dark:text-white/50'>{t("checkout.text24")} </p>

                    <p> {props.telephone}</p>
                </div>

                <div className='flex items-center text-lg space-x-2 font-lato'>
                    <p className='text-base text-black/50 dark:text-white/50'>{t("checkout.text25")}</p>

                    <p> {props.street}</p>
                </div>
                <p>
                    {props.postalCode}  {props.city}
                </p>
                <p>{t(`country.${props.country}`)} </p>

                <p> {props.extra}</p>


            </div>
        </div>
    );
}

export default AddressTemplateCheckout;