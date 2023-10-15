import React, { useState, useEffect, useContext, useRef } from "react";
import { IoColorFillOutline, IoTextOutline } from "react-icons/io5";
import { BsFlower1 } from "react-icons/bs";
import {
  AiOutlinePicture,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineClose,
} from "react-icons/ai";

import RoundedColor from "../elements/RoundedColor";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { CloudinaryContext } from "cloudinary-react";
import { ChromePicker } from "react-color";
import TransformedImage from "../elements/TransformedImage";
import colorsData from "../../colorsData";
import TypeButtonDesign from "../elements/TypeButtonDesign";
import { CustomContext } from "../elements/CustomProvider";
import {
  handleColorChange,
  handleColorSelection,
  getCurrentColor,
  isColorSelected,
  changeColorToRed,
  shouldShowButton,
  handleDeleteColor,
} from "../../colorsUtlils";
import { onSelectFile, getCroppedImageFile } from "src/graphicsUtils";
import axios from "axios";
import side_left from "../../assets/images/side_left.png"
import side_right from "../../assets/images/side_right.png"
import "react-image-crop/dist/ReactCrop.css";
import GraphicsCropDiv from "../elements/GraphicsCropDiv";
import ToogleButtonSwosh from "../elements/ToogleButtonSwosh";
import {
  defaultTextArray,
  textArrayWithCroppedImageLeft,
  textArrayWithCroppedImageRight,
  textArrayWithBothCroppedImage,
  textArrayWithCroppedImageLeftWithoutSwoosh,
  textArrayWithCroppedImageRightWithoutSwoosh,
  textArrayWithBothCroppedImageWithoutSwooshLeft,
  textArrayWithBothCroppedImageWithoutSwooshRight,
  textArrayWithBothCroppedImageWithoutSwoosh,
} from '../../textArraysCustom';
import ColoPickerTextDiv from "../elements/ColoPickerTextDiv";
import PatchesDiv from "../elements/PatchesDiv";


interface DesignSectionProps {
  onDesignFinish: () => void;
  photos: string[];
  patches: { url: string; name: string }[];
}

function DesignSection(props: DesignSectionProps) {
  const [croppedArea, setCroppedArea] = useState<Blob | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isColorChanging, setIsColorChanging] = useState(false);
  const [sideView, setSideView] = useState("");
  const [showColorPicker, setShowColorPicker] = useState("");
  const [showPatchesDiv, setShowPatchesDiv] = useState("");
  const [isDivBackVisible, setIsDivBackVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<number | null>(0)
  const [leftSideImage, setLeftSideImage] = useState<string | null>(null);
  const [rightSideImage, setRightSideImage] = useState<string | null>(null);
  const { selectedColors, setSelectedColors, setLeftSideImageCropped,
    setRightSideImageCropped, leftSideImageCropped,
    rightSideImageCropped, isLeftSwooshVisible,
    isRightSwooshVisible, setIsLeftSwooshVisible,
    setIsRightSwooshVisible, leftSideText, setLeftSideText,
    rightSideText, setRightSideText, setSelectedColorsText, selectedColorsText,
    selectedPatches, setSelectedPatches } = useContext(CustomContext);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const textArray = (() => {
    if (leftSideImageCropped && rightSideImageCropped && !isLeftSwooshVisible && !isRightSwooshVisible) {
      return textArrayWithBothCroppedImageWithoutSwoosh;
    } else if (leftSideImageCropped && rightSideImageCropped && !isLeftSwooshVisible) {
      return textArrayWithBothCroppedImageWithoutSwooshLeft
    } else if (leftSideImageCropped && rightSideImageCropped && !isRightSwooshVisible) {
      return textArrayWithBothCroppedImageWithoutSwooshRight
    } else if (leftSideImageCropped && !isLeftSwooshVisible) {
      return textArrayWithCroppedImageLeftWithoutSwoosh;
    } else if (rightSideImageCropped && !isRightSwooshVisible) {
      return textArrayWithCroppedImageRightWithoutSwoosh;
    } else if (leftSideImageCropped && rightSideImageCropped) {
      return textArrayWithBothCroppedImage;
    } else if (leftSideImageCropped) {
      return textArrayWithCroppedImageLeft;
    } else if (rightSideImageCropped) {
      return textArrayWithCroppedImageRight;
    } else {
      return defaultTextArray;
    }
  })();

  const buttonStyle = "text-black bg-white dark:bg-[#3b3b3b] dark:text-white rounded-full border-2 border-black/60 dark:border-white/70 hover:bg-black/80 hover:text-white hover:dark:text-black hover:dark:bg-white "

  const handleChangeTextLeft = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setLeftSideText(newValue); // Aktualizacja stanu po zmianie wartości pola tekstowego
    setSideView("left")
  };

  const handleChangeTextRight = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setRightSideText(newValue);
    setSideView("right") // Aktualizacja stanu po zmianie wartości pola tekstowego
  };

  const handleNextText = () => {
    setCurrentTextIndex(
      (prevIndex: number) => (prevIndex + 1) % textArray.length
    );
  };

  const handlePreviousText = () => {
    setCurrentTextIndex((prevIndex: number) =>
      prevIndex === 0 ? textArray.length - 1 : prevIndex - 1
    );
  };

  const renderImageSource = () => {
    if (["tip_1", "quarter_1", "swoosh_1", "heel_1", "heel_logo", "toe", "eyestay_1"].includes(textArray[currentTextIndex])) {
      return props.photos[0];
    } else {
      return props.photos[1];
    }
  };

  const handleDivClick = (index: number) => {
    if (selectedType !== index) {
      setSelectedType(index);
    }
  };

  useEffect(() => {
    // Wywołaj changeColorToRed i ustaw isColorChanging na true
    changeColorToRed(selectedColors, setSelectedColors, currentTextIndex, textArray);
    setIsColorChanging(true);

    setTimeout(() => {
      // Po określonym czasie ustaw isColorChanging z powrotem na false
      setIsColorChanging(false);
    }, 500);
  }, [currentTextIndex]);

  const buttonVisible = shouldShowButton(currentTextIndex, selectedColors, isColorChanging, textArray);

  // const restartDesign = () => {
  //   const newSelectedColors = {
  //     selectedColorSwosh_1: { rgb: { r: 255, g: 255, b: 255 } },
  //     selectedColorTip_1: { rgb: { r: 255, g: 255, b: 255 } },
  //     selectedColorHill_1: { rgb: { r: 255, g: 255, b: 255 } },
  //     selectedColorQuarter_1: { rgb: { r: 255, g: 255, b: 255 } },
  //     selectedColorHeel_logo_1: { rgb: { r: 255, g: 255, b: 255 } },
  //     selectedColorToe_1: { rgb: { r: 255, g: 255, b: 255 } },
  //     selectedColorEyestay_1: { rgb: { r: 255, g: 255, b: 255 } },
  //     selectedColorQuarter_2: { rgb: { r: 255, g: 255, b: 255 } },
  //     selectedColorSwosh_2: { rgb: { r: 255, g: 255, b: 255 } },
  //     selectedColorHeel_2: { rgb: { r: 255, g: 255, b: 255 } },
  //     selectedColorEyestay_2: { rgb: { r: 255, g: 255, b: 255 } },
  //   };

  //   setSelectedColors(newSelectedColors);

  //   axios
  //     .delete(`/clearColorsDesign`)
  //     .then((response) => {
  //       console.log(response)
  //     })
  //     .catch((error) => {
  //       console.error("Błąd podczas zapisywania kolorow", error);
  //     });

  //   props.onDesignFinish()
  // }

  const saveDesign = () => {
    axios
      .post(`/saveColorsDesign`, { selectedColors })
      .then((response) => {
      })
      .catch((error) => {
        console.error("Błąd podczas zapisywania kolorow", error);
      });

    props.onDesignFinish()
  }

  const closeDesign = () => {
    axios
      .get("/getColorsDesign")
      .then((response) => {
        const { selectedColors } = response.data;
        setSelectedColors(selectedColors)
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania selectedColors", error);
      });

    props.onDesignFinish()
  }

  const handleZoomChange = (event: any) => {
    setZoom(event.target.value);
  };

  const onCropComplete = (
    croppedAreaPercentage: any,
    croppedAreaPixels: any
  ) => {
    setCroppedArea(croppedAreaPixels);
  };

  const processImage = async (image: any, setCroppedImage: (file: any) => void, setImage: (image: any) => void, area: any, side: string) => {
    try {
      if (!image || !area) {
        throw new Error("Proszę wybrać zdjęcie");
      }

      const croppedImageFile = await getCroppedImageFile(image, area);

      setCroppedImage(croppedImageFile);

      setSideView(side)
      setImage("");

    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  const deleteImageCropped = (setImageCropped: any, setIsSwooshVisible: any) => {
    setIsSwooshVisible(true)
    setImageCropped(null);
  }

  useEffect(() => {
    if (!rightSideText || !leftSideText) {
      const updatedColors = { ...selectedColorsText };

      if (!rightSideText) {
        updatedColors.selectedColorRightText = { rgb: { r: 0, g: 0, b: 0 } };
      }

      if (!leftSideText) {
        updatedColors.selectedColorLeftText = { rgb: { r: 0, g: 0, b: 0 } };
      }

      setSelectedColorsText(updatedColors);
    }
  }, [rightSideText, leftSideText]);

  const renderPatch = (selectedPatch: any, style: string) => {
    const patch = props.patches.find(patch => patch.name === selectedPatch);

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

  useEffect(() => {

    if (sideView === "left") {
      setCurrentTextIndex(0);
    } else if (sideView === "right") {
      const lastIndex = textArray.length - 1;
      setCurrentTextIndex(lastIndex);
    } else {
      setCurrentTextIndex(0);
    }

  }, [textArray, sideView]);

  console.log(sideView)

  return (
    <>
      {showPatchesDiv === "left" && (
        <PatchesDiv setShowDiv={setShowPatchesDiv}
          setPatche={(patchName) => setSelectedPatches({ ...selectedPatches, selectedLeftPatch: patchName })}
          setSideView={setSideView}
          side="left"
        />
      )}

      {showPatchesDiv === "right" && (
        <PatchesDiv setShowDiv={setShowPatchesDiv}
          setPatche={(patchName) => setSelectedPatches({ ...selectedPatches, selectedRightPatch: patchName })}
          setSideView={setSideView}
          side="right"
        />
      )}

      {showColorPicker === "left" && (
        <ColoPickerTextDiv
          setShowDiv={setShowColorPicker}
          color={selectedColorsText.selectedColorLeftText.rgb}
          setSelectedColors={setSelectedColorsText}
          selectedColors={selectedColorsText}
          selectedColorType="left"
          setSideView={setSideView}

        />
      )}

      {showColorPicker === "right" && (
        <ColoPickerTextDiv setShowDiv={setShowColorPicker}
          color={selectedColorsText.selectedColorRightText.rgb}
          setSelectedColors={setSelectedColorsText}
          selectedColors={selectedColorsText}
          selectedColorType="right"
          setSideView={setSideView}
        />
      )}

      {leftSideImage && (
        <GraphicsCropDiv
          image={leftSideImage || ""}
          crop={crop}
          zoom={zoom}
          setZoom={setZoom}
          setCrop={setCrop}
          setImage={setLeftSideImage}
          handleZoomChange={handleZoomChange}
          onCropComplete={onCropComplete}
          submit={() => processImage(leftSideImage, setLeftSideImageCropped, setLeftSideImage, croppedArea, "left")}
        />
      )}

      {rightSideImage && (
        <GraphicsCropDiv
          image={rightSideImage || ""}
          crop={crop}
          zoom={zoom}
          setZoom={setZoom}
          setCrop={setCrop}
          setImage={setRightSideImage}
          handleZoomChange={handleZoomChange}
          onCropComplete={onCropComplete}
          submit={() => processImage(rightSideImage, setRightSideImageCropped, setRightSideImage, croppedArea, "right")}
        />
      )}

      {isDivBackVisible && (
        <div className='bg-black/50 backdrop-blur-sm fixed w-full h-screen z-20 flex justify-center items-center '>
          <div className="bg-white rounded-lg w-[45rem] text-center py-8">
            <p className="text-3xl text-black">Czy na pewno chcesz wyjść?</p>
            <p className="text-2xl text-black/80 mt-4">Wyjście spowoduje utrate dotychczasowych zmian projektu</p>

            <div className="flex justify-center items-center space-x-10 mt-10">
              <button onClick={() => setIsDivBackVisible(!isDivBackVisible)} className="border-2 border-black/80 rounded-full px-10 py-3 hover:bg-black/80 hover:text-white">
                <p className="text-lg">NIE</p>
              </button>

              <button onClick={closeDesign} className="border-2 border-black/80 rounded-full  px-10 py-3 hover:bg-black/80 hover:text-white">
                <p className="text-lg">TAK</p>
              </button>

            </div>
          </div>


        </div>
      )}

      <div className="w-full ">
        <div className="flex flex-col absolute top-10 left-10 z-10 space-y-4">
          <button
            onClick={() => setIsDivBackVisible(!isDivBackVisible)}
            className={`px-8 py-3 ${buttonStyle} `}
          >
            <p className="text-lg">Back</p>
          </button>

          <button
            onClick={saveDesign}
            className={`px-8 py-3 bg-black/80 dark:bg-white/80 text-white dark:text-black rounded-full hover:bg-black hover:dark:bg-white`}
          >
            <p className="text-lg">Save</p>
          </button>
        </div>

        <div className="flex bg-white dark:bg-[#3b3b3b] h-[45rem] border-b-2 border-black/20 dark:border-white/30">
          <div className="flex justify-center items-center w-[70%] border-r-2 border-black/20 dark:border-white/30">
            <div className="relative">
              <img
                className="h-[35rem] rounded-xl"
                src={renderImageSource()}
              />

              <>
                <CloudinaryContext cloudName="dlrhphkcb">
                  {["tip_1", "quarter_1", "swoosh_1", "heel_1", "heel_logo", "toe", "eyestay_1"].includes(textArray[currentTextIndex]) ? (
                    <>

                      <img
                        src={leftSideImageCropped ? URL.createObjectURL(leftSideImageCropped) : ""}
                        className="h-[16rem] absolute top-[10rem] left-[22rem] opacity-80"
                      />
                      <img
                        src={side_left}
                        className="h-[35rem] rounded-xl absolute top-0 left-0 "
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
                        <div className="absolute  w-[10rem] bottom-[12rem] left-[14rem] text-center">
                          <p className="text-2xl"
                            style={{
                              color: `rgb(${selectedColorsText.selectedColorLeftText.rgb.r}, ${selectedColorsText.selectedColorLeftText.rgb.g}, ${selectedColorsText.selectedColorLeftText.rgb.b})`,
                            }}
                          >{leftSideText}</p>
                        </div>
                      )}
                      {renderPatch(selectedPatches.selectedLeftPatch, "absolute bottom-[14rem] right-[6.5rem] max-w-[5rem] max-h-[4rem]")}
                    </>
                  ) : (
                    <>
                      <img
                        src={rightSideImageCropped ? URL.createObjectURL(rightSideImageCropped) : ""}
                        className="h-[16rem] absolute top-[10rem] left-[3.5rem] opacity-80"
                      />
                      <img
                        src={side_right}
                        className="h-[35rem] rounded-xl absolute top-0 left-0 "
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
                        <div className="absolute  w-[10rem] bottom-[12.5rem] right-[14rem] text-center">
                          <p
                            className="text-2xl"
                            style={{
                              color: `rgb(${selectedColorsText.selectedColorRightText.rgb.r}, ${selectedColorsText.selectedColorRightText.rgb.g}, ${selectedColorsText.selectedColorRightText.rgb.b})`,
                            }}
                          >{rightSideText}</p>
                        </div>
                      )}
                      {renderPatch(selectedPatches.selectedRightPatch, "absolute bottom-[14.5rem] left-[6.5rem] max-w-[5rem] max-h-[4rem]")}
                    </>
                  )}
                </CloudinaryContext>
              </>
            </div>
          </div>
          <div className="w-30% mx-auto mt-10">
            <div className="flex space-x-4">
              <TypeButtonDesign
                index={0}
                selectedType={selectedType}
                onClick={handleDivClick}
                icon={<IoColorFillOutline size={35} />}
              />

              <TypeButtonDesign
                index={1}
                selectedType={selectedType}
                onClick={handleDivClick}
                icon={<IoTextOutline size={35} />}
              />

              <TypeButtonDesign
                index={2}
                selectedType={selectedType}
                onClick={handleDivClick}
                icon={<AiOutlinePicture size={35} />}
              />

              <TypeButtonDesign
                index={3}
                selectedType={selectedType}
                onClick={handleDivClick}
                icon={<BsFlower1 size={35} />}
              />
            </div>

            {selectedType === 0 && (
              <div className="flex flex-col mt-10 text-black dark:text-white">
                <p className="text-xl ">Popularne kolory</p>

                <div className="flex flex-wrap w-[25rem] items-start ">
                  {colorsData.map((color, index) => (
                    <RoundedColor
                      key={index}
                      color={color.color}
                      background={color.background}
                      onClick={() =>
                        handleColorSelection(
                          color.color,
                          currentTextIndex,
                          selectedColors,
                          setSelectedColors,
                          textArray
                        )
                      }
                      isSelected={isColorSelected(
                        currentTextIndex, // Aktualny indeks
                        selectedColors, // Obiekt z wybranymi kolorami
                        color.color,
                        textArray
                      )}
                    />
                  ))}
                </div>

                <p className="text-xl mt-10 ">Wybierz swój własny kolor</p>

                <div className="flex space-x-10 items-center">
                  <ChromePicker
                    color={getCurrentColor(currentTextIndex, selectedColors, textArray)}
                    onChange={
                      (newColor: any) =>
                        handleColorChange(
                          newColor,
                          currentTextIndex,
                          selectedColors,
                          setSelectedColors,
                          textArray
                        ) // Użyj handleColorChange z odpowiednimi argumentami
                    }
                    className="mt-6"
                  />

                  <button
                    style={{ display: buttonVisible ? "block" : "none" }}
                    onClick={() => handleDeleteColor(currentTextIndex, selectedColors, setSelectedColors, textArray)}
                    className={`px-4 h-[3.5rem] ${buttonStyle} `}>
                    <p className="text-xl">Usuń kolor</p>
                  </button>
                </div>

              </div>
            )}

            {selectedType === 1 && (
              <div className="flex flex-col mt-6 ">

                <div className="flex flex-col mt-6">
                  <p className="text-xl text-black dark:text-white ">Wpisz tekst po <span className="text-red-500">zewnetrznej</span> stronie</p>
                  <input
                    type="text"
                    value={leftSideText}
                    maxLength={12}
                    onChange={handleChangeTextLeft}
                    className="mt-2 w-full px-2 h-[4rem] text-xl bg-white dark:bg-white/70 border-2 border-black/50 rounded-lg outline-none"
                  ></input>
                  <p className="text-lg mt-2 text-black/60 dark:text-white/60">
                    Możesz wpisać do 12 znaków
                  </p>


                  {leftSideText && (<div className="flex items-center mt-10 space-x-8">
                    <p className="text-xl text-black dark:text-white ">Wybierz kolor tekstu</p>
                    <div onClick={() => setShowColorPicker("left")}
                      className="cursor-pointer rounded-lg h-[2rem] w-[4rem] bg-black"
                      style={{
                        backgroundColor: `rgb(${selectedColorsText.selectedColorLeftText.rgb.r}, ${selectedColorsText.selectedColorLeftText.rgb.g}, ${selectedColorsText.selectedColorLeftText.rgb.b})`,
                      }}
                    ></div>
                  </div>)}

                </div>
                <div className="h-[2px] w-full bg-black/30 dark:bg-white/50 mt-10"></div>
                <div className="flex flex-col mt-6">
                  <p className="text-xl text-black dark:text-white ">Wpisz tekst po <span className="text-red-500">wewnętrznej</span> stronie</p>
                  <input
                    type="text"
                    value={rightSideText}
                    maxLength={12}
                    onChange={handleChangeTextRight}
                    className="mt-2 w-full px-2 h-[4rem] text-xl bg-white dark:bg-white/70 border-2 border-black/50 rounded-lg outline-none"
                  ></input>
                  <p className="text-lg mt-2 text-black/60 dark:text-white/60">
                    Możesz wpisać do 12 znaków
                  </p>

                  {rightSideText && (<div className="flex items-center mt-10 space-x-8">
                    <p className="text-xl text-black dark:text-white ">Wybierz kolor tekstu</p>
                    <div onClick={() => setShowColorPicker("right")}
                      className="cursor-pointer rounded-lg h-[2rem] w-[4rem]"
                      style={{
                        backgroundColor: `rgb(${selectedColorsText.selectedColorRightText.rgb.r}, ${selectedColorsText.selectedColorRightText.rgb.g}, ${selectedColorsText.selectedColorRightText.rgb.b})`,
                      }}
                    ></div>
                  </div>)}

                </div>
              </div>
            )}

            {selectedType === 2 && (
              <div className="flex flex-col mt-10 ">
                <p className="text-xl text-black dark:text-white ">Dodaj zdjęcie na <span className="text-red-500">zewnetrzna</span> strone buta</p>

                <div className="flex items-center mt-6">

                  {!leftSideImageCropped ? (
                    <label className={`py-2 px-4 border-2 cursor-pointer text-base ${buttonStyle} `}>
                      Dodaj zdjecie
                      <input
                        type="file"
                        name="left_side_graphicDesign"
                        accept="image/jpeg, image/jpg"
                        className="hidden"
                        onChange={(event) => onSelectFile(event, setLeftSideImage)}
                      />
                    </label>
                  ) : (
                    <>
                      <img
                        src={leftSideImageCropped ? URL.createObjectURL(leftSideImageCropped) : ""}
                        className="h-[5rem] rounded-lg"
                      />
                      <div onClick={() => {
                        deleteImageCropped(setLeftSideImageCropped, setIsLeftSwooshVisible)
                        setSideView("left")
                      }
                      } className="flex items-center ml-4 cursor-pointer text-balck/80 dark:text-white/80">
                        <AiOutlineClose size={25} />
                        <p className="text-xl ">Usuń zdjęcie</p>
                      </div>
                    </>
                  )}

                </div>

                <p className="text-xl text-black dark:text-white mt-10">Dodaj zdjęcie na <span className="text-red-500">wewnętrzna</span> strone buta</p>

                <div className="flex items-center mt-6">
                  {!rightSideImageCropped ? (
                    <label className={`py-2 px-4 border-2 cursor-pointer text-base ${buttonStyle} `}>
                      Dodaj zdjecie
                      <input
                        type="file"
                        name="right_side_graphicDesign"
                        accept="image/jpeg, image/jpg"
                        className="hidden"
                        onChange={(event) => onSelectFile(event, setRightSideImage)}
                      />
                    </label>
                  ) : (
                    <>
                      <img
                        src={rightSideImageCropped ? URL.createObjectURL(rightSideImageCropped) : ""}
                        className="h-[5rem] rounded-lg"
                      />
                      <div onClick={() => {
                        deleteImageCropped(setRightSideImageCropped, setIsRightSwooshVisible)
                        setSideView("right")
                      }} className="flex items-center ml-4 cursor-pointer text-balck/80 dark:text-white/80">
                        <AiOutlineClose size={25} />
                        <p className="text-xl">Usuń zdjęcie</p>
                      </div>
                    </>
                  )}
                </div>

                {leftSideImageCropped && (
                  <div className="flex items-center mt-10">
                    <p className="text-xl text-balck/80 dark:text-white/80 ">Zewnętrzny swoosh</p>
                    <ToogleButtonSwosh isSwooshVisible={isLeftSwooshVisible} setIsSwooshVisible={setIsLeftSwooshVisible} side="left" setSideView={setSideView} />
                  </div>
                )}

                {rightSideImageCropped && (
                  <div className="flex items-center mt-10">
                    <p className="text-xl text-balck/80 dark:text-white/80">Wewnętrzny swoosh</p>
                    <ToogleButtonSwosh isSwooshVisible={isRightSwooshVisible} setIsSwooshVisible={setIsRightSwooshVisible} side="right" setSideView={setSideView} />
                  </div>
                )}

              </div>
            )}

            {selectedType === 3 && (
              <div className="flex flex-col mt-10">
                <p className="text-xl text-black dark:text-white">
                  Wybierz naszywkę na <span className="text-red-500">zewnetrzna</span> strone buta
                </p>

                {!selectedPatches.selectedLeftPatch ? (
                  <div className="flex items-center mt-6">
                    <button onClick={() => setShowPatchesDiv("left")} className={`py-2 px-4 border-2 cursor-pointer text-base ${buttonStyle} `}>
                      <p>Dodaj naszywke</p>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center mt-8">
                    {renderPatch(selectedPatches.selectedLeftPatch, "max-w-[6rem] max-h-[5rem]")}
                    <div onClick={() => {
                      setSelectedPatches({ ...selectedPatches, selectedLeftPatch: "" })
                      setSideView("left")
                    }} className="flex items-center ml-4 cursor-pointer text-black/80 dark:text-white/80">
                      <AiOutlineClose size={25} />
                      <p className="text-xl">Usuń naszywke</p>
                    </div>
                  </div>)}


                <p className="text-xl text-black dark:text-white mt-10">
                  Wybierz naszywkę na <span className="text-red-500">wewnetrzna</span> strone buta
                </p>

                {!selectedPatches.selectedRightPatch ? (
                  <div className="flex items-center mt-6">
                    <button onClick={() => setShowPatchesDiv("right")} className={`py-2 px-4 border-2 cursor-pointer text-base ${buttonStyle} `}>
                      <p>Dodaj naszywke</p>
                    </button>
                  </div>) : (
                  <div className="flex items-center mt-8">
                    {renderPatch(selectedPatches.selectedRightPatch, "max-w-[6rem] max-h-[5rem]")}
                    <div onClick={() => {
                      setSelectedPatches({ ...selectedPatches, selectedRightPatch: "" })
                      setSideView("right")
                    }} className="flex items-center ml-4 cursor-pointer text-black/80 dark:text-white/80">
                      <AiOutlineClose size={25} />
                      <p className="text-xl">Usuń naszywke</p>
                    </div>
                  </div>)}

              </div>
            )}
          </div>
        </div>

        <div className="flex w-[24rem]  mx-auto justify-between items-center  mt-10 text-black dark:text-white">
          <AiOutlineArrowLeft
            size={30}
            className="cursor-pointer"
            onClick={handlePreviousText}
          />

          <div className="flex space-x-2 text-xl font-medium">
            <p className=" text-black dark:text-white">
              {textArray[currentTextIndex]}
            </p>
            <p className=" text-black/50 dark:text-white/60">{`${currentTextIndex + 1
              }/${textArray.length}`}</p>
          </div>

          <AiOutlineArrowRight
            size={30}
            className="cursor-pointer"
            onClick={handleNextText}
          />
        </div>
      </div>
    </>
  );
}

export default DesignSection;
