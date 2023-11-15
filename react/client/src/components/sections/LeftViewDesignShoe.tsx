import React, { useContext, useEffect, useState } from 'react';
import { CloudinaryContext } from "cloudinary-react";
import TransformedImage from "../elements/TransformedImage";
import side_left from "../../assets/images/side_left.png"
import renderPatch from 'src/resources/renderPatch';
import { CustomContext } from "../elements/CustomProvider";
import { SelectedColors, SelectedColorsText } from "src/types";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import storage from "../../resources/firebase";
import { UserContext } from "../elements/UserProvider";
import { useTranslation } from "react-i18next";


interface LeftViewDesignShoeProps {
    isLeftSwooshVisible: boolean
    userId: string
    leftText: string
    selectedLeftPatch: string
    selectedColors: SelectedColors
    selectedColorsText: SelectedColorsText
    designName: string
    orderNumber?: string
    setError: (error: string) => void
}

function LeftViewDesignShoe(props: LeftViewDesignShoeProps) {

    const { user } = useContext(UserContext);
    const { t } = useTranslation();

    const { patches, photos, isPhotos_Patches } = useContext(CustomContext);
    const [imageUrl, setImageUrl] = useState("");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let userStorageRef;

                if (props.designName) {
                    userStorageRef = ref(storage, `/designProject/${user?._id}/${props.designName}`);
                } else if (props.orderNumber) {
                    userStorageRef = ref(storage, `/orderCustomProjects/${props.userId}/${props.orderNumber}`);
                } else {
                    userStorageRef = ref(storage, `/customImages/${user?._id}`);
                }

                const data = await listAll(userStorageRef);

                if (data.items.length > 0) {
                    const userImages = data.items;
                    const leftImage = userImages.filter(item => item.name.startsWith('left'));

                    if (leftImage.length > 0) {
                        const leftImageRef = leftImage[0];
                        const leftImageURL = await getDownloadURL(leftImageRef);
                        setImageUrl(leftImageURL);
                    }
                }
                setIsReady(true)
            } catch (error) {
                const text = t("customization.text12")
                props.setError(text)
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {isReady && isPhotos_Patches &&
                (<div className="relative ">
                    <img
                        className="h-[10rem] rounded-xl"
                        src={photos[0]}
                    />

                    <img
                        src={imageUrl}
                        className="h-[4.7rem] absolute top-[2.8rem] left-[6rem] opacity-80"
                    />
                    <img
                        src={side_left}
                        className="h-[10rem] rounded-xl absolute top-0 left-0 "
                    />

                    <CloudinaryContext cloudName="dlrhphkcb">

                        <>
                            {!imageUrl && (
                                <>
                                    <TransformedImage
                                        publicId="elements/quarter_1_ycvbpt.png"
                                        rgb={props.selectedColors.selectedColorQuarter_1.rgb}
                                        opacity="opacity-70"
                                    />
                                    <TransformedImage
                                        publicId="elements/hill_1_h370h8.png"
                                        rgb={props.selectedColors.selectedColorHill_1.rgb}
                                        opacity="opacity-70"
                                    />
                                </>
                            )}

                            <TransformedImage
                                publicId="elements/tip_1_jxccem.png"
                                rgb={props.selectedColors.selectedColorTip_1.rgb}
                                opacity="opacity-70"
                            />
                            {props.isLeftSwooshVisible && (
                                <TransformedImage
                                    publicId="elements/swosh_1_pxffyd.png"
                                    rgb={props.selectedColors.selectedColorSwosh_1.rgb}
                                    opacity={imageUrl ? "opacity-100" : "opacity-70"}
                                />
                            )}
                            <TransformedImage
                                publicId="elements/heel_logo_1_nowlsy.png"
                                rgb={props.selectedColors.selectedColorHeel_logo_1.rgb}
                                opacity="opacity-70"
                            />
                            <TransformedImage
                                publicId="elements/toe_1_uz2weu.png"
                                rgb={props.selectedColors.selectedColorToe_1.rgb}
                                opacity="opacity-70"
                            />
                            <TransformedImage
                                publicId="elements/Eyestay_1_z5b6jc.png"
                                rgb={props.selectedColors.selectedColorEyestay_1.rgb}
                                opacity="opacity-70"
                            />
                            {props.leftText && (
                                <div className="absolute w-[10rem] bottom-[3.35rem] left-[0.5rem]  text-center opacity-80">
                                    <p className="text-[0.43rem] "
                                        style={{
                                            color: `rgb(${props.selectedColorsText.selectedColorLeftText.rgb.r}, ${props.selectedColorsText.selectedColorLeftText.rgb.g}, ${props.selectedColorsText.selectedColorLeftText.rgb.b})`,
                                        }}
                                    >{props.leftText}</p>
                                </div>
                            )}
                            {renderPatch(props.selectedLeftPatch, "absolute bottom-[4rem] right-[1.8rem] max-w-[1.4rem] max-h-[1.1rem]  opacity-90", patches)}
                        </>

                    </CloudinaryContext>

                </div>)}



        </>
    );
}

export default LeftViewDesignShoe;