import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { formatPrice } from "src/currencyUtils";
import LeftViewDesignShoe from '../sections/LeftViewDesignShoe';
import { ProjectItem } from "src/types";

interface OrderCustomShoeTemplateProps {
    orderNumber: string;
    _id: string
    status: string;
    price: number
    project: ProjectItem;
    clickDetails: (orderId: string) => void
}

function OrderCustomShoeTemplate(props: OrderCustomShoeTemplateProps) {

    const [errorsServer, setErrorsServer] = useState("");

    const { t } = useTranslation();

    const getStatusColor = () => {
        switch (props.status) {
            case "submitted":
                return "text-blue-500";
            case "preparing":
                return "text-yellow-500";
            case "shipped":
                return "text-[#8c03fc]";
            case "delivered":
                return "text-green-500";
            default:
                return "text-black/80";
        }
    };

    const statusColor = getStatusColor();

    return (
        <div className="w-full py-6 px-10 border-b-2 border-black/10 dark:border-white/30 text-black/80 dark:text-white/80" >
            <div className="flex justify-between items-center  text-lg md:text-xl">
                <div className="flex items-center space-x-2">
                    <p className="hidden sm:flex">{t("order.text1")} </p>
                    <p className="font-bold">{props.orderNumber}</p>
                </div>

                <div>
                    <div className="flex items-center space-x-2">
                        <p className="hidden md:block">{t("order.text2")} </p>
                        <p className={`font-bold ${statusColor}`}>
                            {t(`status.${props.status}`)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex mt-4">

                <LeftViewDesignShoe
                    isLeftSwooshVisible={
                        props.project.swooshVisibility.isLeftSwooshVisible
                    }
                    leftText={"SnekaersZone"}
                    selectedLeftPatch={
                        props.project.selectedPatches.selectedLeftPatch
                    }
                    selectedColors={props.project.selectedColors}
                    selectedColorsText={props.project.selectedColorsText}
                    designName={""}
                    orderNumber={props.orderNumber}
                    setError={setErrorsServer}
                />

            </div>

            <div className="flex justify-between items-center  mt-6 text-base md:text-lg ">
                <div>
                    <p>
                        {t("order.text3")}{" "}
                        <span className="font-bold">{formatPrice(props.price, t)}</span>
                    </p>
                </div>

                <div>
                    <button
                        onClick={() => props.clickDetails(props._id)}
                        className="font-bold hover:scale-105 ease-in-out duration-300"
                    >
                        {t("order.text4")}
                    </button>
                </div>
            </div>
        </div >
    );
}

export default OrderCustomShoeTemplate;