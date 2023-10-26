import React, { useContext, useEffect, useState } from 'react';
import { CustomContext } from "../elements/CustomProvider";
import { CloudinaryContext } from "cloudinary-react";
import TransformedImage from "../elements/TransformedImage";
import LoadingAnimationSmall from "../elements/LoadingAnimatonSmall";
import {
    MdArrowForwardIos,
    MdArrowBackIos
} from "react-icons/md";
import side_left from "../../assets/images/side_left.png"
import side_right from "../../assets/images/side_right.png"
import renderPatch from 'src/renderPatch';

interface PersonalizedShoesViewProps {
}

function PersonalizedShoesView(props: PersonalizedShoesViewProps) {

    const { selectedColors, setSelectedColors,
        leftSideImageCropped, rightSideImageCropped,
        swooshVisibility, selectedColorsText, sideText, selectedPatches, imagesUrls, patches, photos, isPhotos_Patches } = useContext(CustomContext);
    const [currentIndex, setCurrentIndex,] = useState(0);
    const [isDataFetched, setIsDataFetched] = useState(false);

    const handlePreviousPhoto = () => {
        setCurrentIndex((prevIndex: number) =>
            prevIndex === 0 ? photos.length - 1 : prevIndex - 1
        );
    };

    const handleNextPhoto = () => {
        setCurrentIndex((prevIndex: number) => (prevIndex + 1) % photos.length);
    };

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
                                    src={imagesUrls.leftSideImageCroppedUrl}
                                    className="h-[8rem] absolute top-[4.7rem] left-[10.3rem] opacity-80"
                                />
                                <img
                                    src={side_left}
                                    className="h-[17rem]  rounded-xl absolute top-0 left-0 "
                                />

                                {!imagesUrls.leftSideImageCroppedUrl && (
                                    <>
                                        <TransformedImage
                                            publicId="elements/quarter_1_ycvbpt.png"
                                            rgb={selectedColors.selectedColorQuarter_1.rgb}
                                            opacity="opacity-70"
                                        />
                                        <TransformedImage
                                            publicId="elements/hill_1_h370h8.png"
                                            rgb={selectedColors.selectedColorHill_1.rgb}
                                            opacity="opacity-70"
                                        />
                                    </>
                                )}

                                <TransformedImage
                                    publicId="elements/tip_1_jxccem.png"
                                    rgb={selectedColors.selectedColorTip_1.rgb}
                                    opacity="opacity-70"
                                />
                                {swooshVisibility.isLeftSwooshVisible && (
                                    <TransformedImage
                                        publicId="elements/swosh_1_pxffyd.png"
                                        rgb={selectedColors.selectedColorSwosh_1.rgb}
                                        opacity={imagesUrls.leftSideImageCroppedUrl ? "opacity-100" : "opacity-70"}
                                    />
                                )}
                                <TransformedImage
                                    publicId="elements/heel_logo_1_nowlsy.png"
                                    rgb={selectedColors.selectedColorHeel_logo_1.rgb}
                                    opacity="opacity-70"
                                />
                                <TransformedImage
                                    publicId="elements/toe_1_uz2weu.png"
                                    rgb={selectedColors.selectedColorToe_1.rgb}
                                    opacity="opacity-70"
                                />
                                <TransformedImage
                                    publicId="elements/Eyestay_1_z5b6jc.png"
                                    rgb={selectedColors.selectedColorEyestay_1.rgb}
                                    opacity="opacity-70"
                                />
                                {sideText.leftText && (
                                    <div className="absolute w-[10rem] bottom-[5.8rem] left-[4.3rem]  text-center opacity-80">
                                        <p className="text-xs "
                                            style={{
                                                color: `rgb(${selectedColorsText.selectedColorLeftText.rgb.r}, ${selectedColorsText.selectedColorLeftText.rgb.g}, ${selectedColorsText.selectedColorLeftText.rgb.b})`,
                                            }}
                                        >{sideText.leftText}</p>
                                    </div>
                                )}
                                {renderPatch(selectedPatches.selectedLeftPatch, "absolute bottom-[6.8rem] right-[3rem] max-w-[3rem] max-h-[2rem]  opacity-90", patches)}
                            </>
                        ) : (
                            <>
                                <img

                                    src={imagesUrls.rightSideImageCroppedUrl}
                                    className="h-[8rem] absolute top-[4.7rem] left-[1.7rem]  opacity-80"
                                />
                                <img
                                    src={side_right}
                                    className="h-[17rem]  rounded-xl absolute top-0 left-0 "
                                />

                                <TransformedImage
                                    publicId="elements/toe_2_enco6w.png"
                                    rgb={selectedColors.selectedColorToe_1.rgb}
                                    opacity="opacity-70"
                                />
                                <TransformedImage
                                    publicId="elements/tip_2_bmjg7i.png"
                                    rgb={selectedColors.selectedColorTip_1.rgb}
                                    opacity="opacity-70"
                                />
                                {!imagesUrls.rightSideImageCroppedUrl && (
                                    <>
                                        <TransformedImage
                                            publicId="elements/quarter_2_kjcplp.png"
                                            rgb={selectedColors.selectedColorQuarter_2.rgb}
                                            opacity="opacity-70"
                                        />
                                        <TransformedImage
                                            publicId="elements/heel_2_xtnwp2.png"
                                            rgb={selectedColors.selectedColorHeel_2.rgb}
                                            opacity="opacity-70"
                                        />
                                    </>
                                )}
                                {swooshVisibility.isRightSwooshVisible && (
                                    <TransformedImage
                                        publicId="elements/swosh_2_twgxvt.png"
                                        rgb={selectedColors.selectedColorSwosh_2.rgb}
                                        opacity={imagesUrls.rightSideImageCroppedUrl ? "opacity-100" : "opacity-70"}
                                    />
                                )}
                                <TransformedImage
                                    publicId="elements/heel_logo_2_j4oj49.png"
                                    rgb={selectedColors.selectedColorHeel_logo_1.rgb}
                                    opacity="opacity-70"
                                />
                                <TransformedImage
                                    publicId="elements/eyestay_2_ciar70.png"
                                    rgb={selectedColors.selectedColorEyestay_2.rgb}
                                    opacity="opacity-70"
                                />
                                {sideText.rightText && (
                                    <div className="absolute w-[10rem] bottom-[6rem] right-[4.2rem]  text-center opacity-80">
                                        <p
                                            className="text-xs"
                                            style={{
                                                color: `rgb(${selectedColorsText.selectedColorRightText.rgb.r}, ${selectedColorsText.selectedColorRightText.rgb.g}, ${selectedColorsText.selectedColorRightText.rgb.b})`,
                                            }}
                                        >{sideText.rightText}</p>
                                    </div>
                                )}
                                {renderPatch(selectedPatches.selectedRightPatch, "absolute bottom-[7rem] left-[3rem] max-w-[3rem] max-h-[2rem]  opacity-90", patches)}
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