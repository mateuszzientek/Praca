import React, { useContext, useEffect, useState } from 'react';
import { CustomContext } from "../elements/CustomProvider";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import storage from "../../firebase";
import { CloudinaryContext } from "cloudinary-react";
import TransformedImage from "../elements/TransformedImage";
import LoadingAnimationSmall from "../elements/LoadingAnimatonSmall";
import {
    MdArrowForwardIos,
    MdArrowBackIos
} from "react-icons/md";
import axios from "axios";
import side_left from "../../assets/images/side_left.png"
import side_right from "../../assets/images/side_right.png"

interface PersonalizedShoesViewProps {
}

function PersonalizedShoesView(props: PersonalizedShoesViewProps) {

    const { selectedColors, setSelectedColors,
        leftSideImageCropped, rightSideImageCropped,
        isLeftSwooshVisible, isRightSwooshVisible,
        selectedColorsText, rightSideText, leftSideText, selectedPatches } = useContext(CustomContext);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [photos, setPhotos] = useState<string[]>([]);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [patches, setPatches] = useState<Array<{ url: string; name: string; }>>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const folderRef = ref(storage, `shoeType/low`);
                const res = await listAll(folderRef);
                const urls: string[] = [];

                for (const itemRef of res.items) {
                    try {
                        const url = await getDownloadURL(itemRef);
                        urls.push(url);
                    } catch (error) {
                        console.log(error);
                    }
                }
                setPhotos(urls);

                const folderPatchesRef = ref(storage, `patches`);
                const resPatches = await listAll(folderPatchesRef);
                const patchInfoArray = [];

                for (const itemRef of resPatches.items) {
                    try {
                        const url = await getDownloadURL(itemRef);
                        const name = itemRef.name; // Pobierz nazwę pliku
                        const patchInfo = { url, name }; // Utwórz obiekt z URL i nazwą
                        patchInfoArray.push(patchInfo); // Dodaj obiekt do tablicy
                    } catch (error) {
                        console.log(error);
                    }
                }

                setPatches(patchInfoArray);
                setIsDataFetched(true);
            } catch (error) {
                console.log(error);
                setIsDataFetched(true);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        axios
            .get("/getColorsDesign")
            .then((response) => {
                const { selectedColors } = response.data;
                setSelectedColors(selectedColors)
            })
            .catch((error) => {
                console.error("Błąd podczas pobierania selectedColors", error);
            });
    }, []);


    const handlePreviousPhoto = () => {
        setCurrentIndex((prevIndex: number) =>
            prevIndex === 0 ? photos.length - 1 : prevIndex - 1
        );
    };

    const handleNextPhoto = () => {
        setCurrentIndex((prevIndex: number) => (prevIndex + 1) % photos.length);
    };

    const renderPatch = (selectedPatch: any, style: string) => {
        const patch = patches.find(patch => patch.name === selectedPatch);

        if (patch) {
            return (
                <img
                    src={patch.url}
                    alt="Patch"
                    className={style}

                />
            );
        }
    }

    return (
        <>
            {!isDataFetched ? (
                <div className="flex justify-center mt-[10rem]">
                    <LoadingAnimationSmall />
                </div>
            ) : (
                <div className="relative">
                    <img
                        className="h-[30rem] rounded-xl"
                        src={photos[currentIndex]}
                    />

                    <CloudinaryContext cloudName="dlrhphkcb">
                        {currentIndex === 0 ? (
                            <>
                                <img
                                    src={leftSideImageCropped ? URL.createObjectURL(leftSideImageCropped) : ""}
                                    className="h-[14rem] absolute top-[8rem] left-[19rem] opacity-80"
                                />
                                <img
                                    src={side_left}
                                    className="h-[30rem] rounded-xl absolute top-0 left-0 "
                                />

                                {!leftSideImageCropped && (
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
                                {isLeftSwooshVisible && (
                                    <TransformedImage
                                        publicId="elements/swosh_1_pxffyd.png"
                                        rgb={selectedColors.selectedColorSwosh_1.rgb}
                                        opacity={leftSideImageCropped ? "opacity-100" : "opacity-70"}
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
                                {leftSideText && (
                                    <div className="absolute  w-[10rem] bottom-[10.3rem] left-[11rem] text-center">
                                        <p className="text-2xl"
                                            style={{
                                                color: `rgb(${selectedColorsText.selectedColorLeftText.rgb.r}, ${selectedColorsText.selectedColorLeftText.rgb.g}, ${selectedColorsText.selectedColorLeftText.rgb.b})`,
                                            }}
                                        >{leftSideText}</p>
                                    </div>
                                )}
                                {renderPatch(selectedPatches.selectedLeftPatch, "absolute bottom-[12rem] right-[5.5rem] max-w-[4.5rem] max-h-[3.5rem]")}
                            </>
                        ) : (
                            <>
                                <img
                                    src={rightSideImageCropped ? URL.createObjectURL(rightSideImageCropped) : ""}
                                    className="h-[14rem] absolute top-[8rem] left-[3rem] opacity-80"
                                />
                                <img
                                    src={side_right}
                                    className="h-[30rem] rounded-xl absolute top-0 left-0 "
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
                                {!rightSideImageCropped && (
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
                                {isRightSwooshVisible && (
                                    <TransformedImage
                                        publicId="elements/swosh_2_twgxvt.png"
                                        rgb={selectedColors.selectedColorSwosh_2.rgb}
                                        opacity={rightSideImageCropped ? "opacity-100" : "opacity-70"}
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
                                {rightSideText && (
                                    <div className="absolute w-[10rem] bottom-[10.5rem] right-[11rem] text-center">
                                        <p
                                            className="text-2xl"
                                            style={{
                                                color: `rgb(${selectedColorsText.selectedColorRightText.rgb.r}, ${selectedColorsText.selectedColorRightText.rgb.g}, ${selectedColorsText.selectedColorRightText.rgb.b})`,
                                            }}
                                        >{rightSideText}</p>
                                    </div>
                                )}
                                {renderPatch(selectedPatches.selectedRightPatch, "absolute bottom-[12.2rem] left-[5.5rem] max-w-[4.5rem] max-h-[3.5rem]")}
                            </>
                        )}
                    </CloudinaryContext>

                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-[20rem] mt-10 text-black ">
                        <MdArrowBackIos size={30} className="cursor-pointer" onClick={handlePreviousPhoto} />
                        <MdArrowForwardIos size={30} className="cursor-pointer" onClick={handleNextPhoto} />
                    </div>
                </div>)
            }



        </>

    );
}

export default PersonalizedShoesView;