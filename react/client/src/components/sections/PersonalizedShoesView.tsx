import React, { useContext, useEffect, useState } from 'react';
import { CustomContext } from "../elements/CustomProvider";
import { CloudinaryContext } from "cloudinary-react";
import TransformedImage from "../elements/TransformedImage";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import storage from "../../resources/firebase";
import LoadingAnimationSmall from "../elements/LoadingAnimatonSmall";
import { UserContext } from "../elements/UserProvider";
import {
    MdArrowForwardIos,
    MdArrowBackIos
} from "react-icons/md";
import side_left from "../../assets/images/side_left.png"
import side_right from "../../assets/images/side_right.png"
import renderPatch from 'src/resources/renderPatch';
import { SelectedColors, SelectedColorsText, SelectedPatches, SwooshVisibility, SideText } from "src/types";

interface PersonalizedShoesViewProps {

    selectedColors: SelectedColors,
    selectedColorsText: SelectedColorsText
    selectedPatches: SelectedPatches
    swooshVisibility: SwooshVisibility
    sideText: SideText
    orderNumber?: string
    userId?: string
}

function PersonalizedShoesView(props: PersonalizedShoesViewProps) {

    const { user } = useContext(UserContext);
    const { imagesUrls, patches, photos, isPhotos_Patches } = useContext(CustomContext);
    const [currentIndex, setCurrentIndex,] = useState(0);
    const [imageUrlLeft, setImageUrlLeft] = useState("");
    const [imageUrlRight, setImageUrlRight] = useState("");

    const handlePreviousPhoto = () => {
        setCurrentIndex((prevIndex: number) =>
            prevIndex === 0 ? photos.length - 1 : prevIndex - 1
        );
    };

    const handleNextPhoto = () => {
        setCurrentIndex((prevIndex: number) => (prevIndex + 1) % photos.length);
    };

    useEffect(() => {

        if (props.orderNumber) {
            const fetchData = async () => {
                try {
                    const userStorageRef = ref(storage, `/orderCustomProjects/${props.userId}/${props.orderNumber}`);

                    const data = await listAll(userStorageRef);

                    if (data.items.length > 0) {
                        const userImages = data.items;
                        const leftImage = userImages.filter((item) =>
                            item.name.startsWith("left")
                        );
                        const rightImage = userImages.filter((item) =>
                            item.name.startsWith("right")
                        );

                        if (leftImage.length > 0) {
                            const leftImageRef = leftImage[0];
                            const leftImageURL = await getDownloadURL(leftImageRef);
                            setImageUrlLeft(leftImageURL);
                        }
                        if (rightImage.length > 0) {
                            const rightImageRef = rightImage[0];
                            const rightImageURL = await getDownloadURL(rightImageRef);
                            setImageUrlRight(rightImageURL);
                        }
                    }
                } catch (error) {
                    console.log("Wystąpił błąd podczas pobierania zdjęć w PersonalizedShoesView")
                }
            };
            fetchData();
        }


    }, []);


    return (
        <>
            {!isPhotos_Patches ? (
                <div className="flex justify-center scale-75">
                    <LoadingAnimationSmall />
                </div>
            ) : (
                <div className="relative">

                    <img
                        className="h-[17rem]  rounded-xl"
                        src={photos[currentIndex]}
                    />

                    <CloudinaryContext cloudName="dlrhphkcb">
                        {currentIndex === 0 ? (
                            <>
                                <img
                                    src={props.orderNumber ? imageUrlLeft : imagesUrls.leftSideImageCroppedUrl}
                                    className="h-[8rem] absolute top-[4.7rem] left-[10.3rem] opacity-80"
                                />
                                <img
                                    src={side_left}
                                    className="h-[17rem]  rounded-xl absolute top-0 left-0 "
                                />

                                {(!imagesUrls.leftSideImageCroppedUrl && !imageUrlLeft) && (
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
                                {props.swooshVisibility.isLeftSwooshVisible && (
                                    <TransformedImage
                                        publicId="elements/swosh_1_pxffyd.png"
                                        rgb={props.selectedColors.selectedColorSwosh_1.rgb}
                                        opacity={(imagesUrls.leftSideImageCroppedUrl || imageUrlLeft) ? "opacity-100" : "opacity-70"}
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
                                {props.sideText.leftText && (
                                    <div className="absolute w-[10rem] bottom-[5.8rem] left-[4.3rem]  text-center opacity-80">
                                        <p className="text-xs "
                                            style={{
                                                color: `rgb(${props.selectedColorsText.selectedColorLeftText.rgb.r}, ${props.selectedColorsText.selectedColorLeftText.rgb.g}, ${props.selectedColorsText.selectedColorLeftText.rgb.b})`,
                                            }}
                                        >{props.sideText.leftText}</p>
                                    </div>
                                )}
                                {renderPatch(props.selectedPatches.selectedLeftPatch, "absolute bottom-[6.8rem] right-[3rem] max-w-[3rem] max-h-[2rem]  opacity-90", patches)}
                            </>
                        ) : (
                            <>
                                <img

                                    src={props.orderNumber ? imageUrlRight : imagesUrls.rightSideImageCroppedUrl}
                                    className="h-[8rem] absolute top-[4.7rem] left-[1.7rem]  opacity-80"
                                />
                                <img
                                    src={side_right}
                                    className="h-[17rem]  rounded-xl absolute top-0 left-0 "
                                />

                                <TransformedImage
                                    publicId="elements/toe_2_enco6w.png"
                                    rgb={props.selectedColors.selectedColorToe_1.rgb}
                                    opacity="opacity-70"
                                />
                                <TransformedImage
                                    publicId="elements/tip_2_bmjg7i.png"
                                    rgb={props.selectedColors.selectedColorTip_1.rgb}
                                    opacity="opacity-70"
                                />
                                {(!imagesUrls.rightSideImageCroppedUrl && !imageUrlRight) && (
                                    <>
                                        <TransformedImage
                                            publicId="elements/quarter_2_kjcplp.png"
                                            rgb={props.selectedColors.selectedColorQuarter_2.rgb}
                                            opacity="opacity-70"
                                        />
                                        <TransformedImage
                                            publicId="elements/heel_2_xtnwp2.png"
                                            rgb={props.selectedColors.selectedColorHeel_2.rgb}
                                            opacity="opacity-70"
                                        />
                                    </>
                                )}
                                {props.swooshVisibility.isRightSwooshVisible && (
                                    <TransformedImage
                                        publicId="elements/swosh_2_twgxvt.png"
                                        rgb={props.selectedColors.selectedColorSwosh_2.rgb}
                                        opacity={(imagesUrls.rightSideImageCroppedUrl || imageUrlRight) ? "opacity-100" : "opacity-70"}
                                    />
                                )}
                                <TransformedImage
                                    publicId="elements/heel_logo_2_j4oj49.png"
                                    rgb={props.selectedColors.selectedColorHeel_logo_1.rgb}
                                    opacity="opacity-70"
                                />
                                <TransformedImage
                                    publicId="elements/eyestay_2_ciar70.png"
                                    rgb={props.selectedColors.selectedColorEyestay_2.rgb}
                                    opacity="opacity-70"
                                />
                                {props.sideText.rightText && (
                                    <div className="absolute w-[10rem] bottom-[6rem] right-[4.2rem]  text-center opacity-80">
                                        <p
                                            className="text-xs"
                                            style={{
                                                color: `rgb(${props.selectedColorsText.selectedColorRightText.rgb.r}, ${props.selectedColorsText.selectedColorRightText.rgb.g}, ${props.selectedColorsText.selectedColorRightText.rgb.b})`,
                                            }}
                                        >{props.sideText.rightText}</p>
                                    </div>
                                )}
                                {renderPatch(props.selectedPatches.selectedRightPatch, "absolute bottom-[7rem] left-[3rem] max-w-[3rem] max-h-[2rem]  opacity-90", patches)}
                            </>
                        )}
                    </CloudinaryContext>

                    <div className="absolute bottom-[1rem]  left-1/2 transform -translate-x-1/2 flex space-x-[10rem] mt-10 text-black ">
                        <MdArrowBackIos size={25} className="cursor-pointer" onClick={handlePreviousPhoto} />
                        <MdArrowForwardIos size={25} className="cursor-pointer" onClick={handleNextPhoto} />
                    </div>
                </div>)
            }



        </>

    );
}

export default PersonalizedShoesView;