import React, { useState, useEffect, useContext } from "react";
import { IoColorFillOutline, IoTextOutline } from "react-icons/io5";
import { BsFlower1 } from "react-icons/bs";
import {
  AiOutlinePicture,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineClose,
} from "react-icons/ai";
import { UserContext } from "../elements/UserProvider";
import {
  ref,
  uploadBytes,
  deleteObject,
  listAll,
} from "firebase/storage";
import storage from "../../resources/firebase";
import RoundedColor from "../elements/RoundedColor";
import { CloudinaryContext } from "cloudinary-react";
import { ChromePicker } from "react-color";
import TransformedImage from "../elements/TransformedImage";
import colorsData from "../../resources/colorsData";
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
} from "../../resources/colorsUtlils";
import { onSelectFile, getCroppedImageFile } from "src/resources/graphicsUtils";
import axios from "axios";
import { ThemeContext } from "../elements/ThemeContext";
import side_left from "../../assets/images/side_left.png";
import side_right from "../../assets/images/side_right.png";
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
} from "../../resources/textArraysCustom";
import ColoPickerTextDiv from "../elements/ColoPickerTextDiv";
import PatchesDiv from "../elements/PatchesDiv";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CircleSvg from "../elements/CircleSvg";
import InfoDivBottom from "../elements/InfoDivBottom";
import renderPatch from "src/resources/renderPatch";

interface DesignSectionProps {
  photos: string[];
  patches: Array<{ url: string; name: string }>;
  param: string | undefined;
}

function DesignSection(props: DesignSectionProps) {

  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const {
    selectedColors,
    setSelectedColors,
    setLeftSideImageCropped,
    setRightSideImageCropped,
    leftSideImageCropped,
    rightSideImageCropped,
    swooshVisibility,
    setSwooshVisibility,
    setSelectedColorsText,
    selectedColorsText,
    sideText,
    setSideText,
    selectedPatches,
    setSelectedPatches,
    setImagesUrls,
    imagesUrls,
  } = useContext(CustomContext);

  //////////Variables/////////////

  const [errorsServer, setErrorsServer] = useState("");
  const [croppedArea, setCroppedArea] = useState<Blob | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteLeftImage, setDeleteLeftImage] = useState(false);
  const [deleteRightImage, setDeleteRightImage] = useState(false);
  const [isColorChanging, setIsColorChanging] = useState(false);
  const [sideView, setSideView] = useState("");
  const [showColorPicker, setShowColorPicker] = useState("");
  const [showPatchesDiv, setShowPatchesDiv] = useState("");
  const [isDivBackVisible, setIsDivBackVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<number | null>(0);
  const [leftSideImage, setLeftSideImage] = useState<string | null>(null);
  const [rightSideImage, setRightSideImage] = useState<string | null>(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const textArray = (() => {
    if (
      (leftSideImageCropped || imagesUrls.leftSideImageCroppedUrl) &&
      (rightSideImageCropped || imagesUrls.rightSideImageCroppedUrl) &&
      !swooshVisibility.isLeftSwooshVisible &&
      !swooshVisibility.isRightSwooshVisible
    ) {
      return textArrayWithBothCroppedImageWithoutSwoosh;
    } else if (
      (leftSideImageCropped || imagesUrls.leftSideImageCroppedUrl) &&
      (rightSideImageCropped || imagesUrls.rightSideImageCroppedUrl) &&
      !swooshVisibility.isLeftSwooshVisible
    ) {
      return textArrayWithBothCroppedImageWithoutSwooshLeft;
    } else if (
      (leftSideImageCropped || imagesUrls.leftSideImageCroppedUrl) &&
      (rightSideImageCropped || imagesUrls.rightSideImageCroppedUrl) &&
      !swooshVisibility.isRightSwooshVisible
    ) {
      return textArrayWithBothCroppedImageWithoutSwooshRight;
    } else if (
      (leftSideImageCropped || imagesUrls.leftSideImageCroppedUrl) &&
      !swooshVisibility.isLeftSwooshVisible
    ) {
      return textArrayWithCroppedImageLeftWithoutSwoosh;
    } else if (
      (rightSideImageCropped || imagesUrls.rightSideImageCroppedUrl) &&
      !swooshVisibility.isRightSwooshVisible
    ) {
      return textArrayWithCroppedImageRightWithoutSwoosh;
    } else if (
      (leftSideImageCropped || imagesUrls.leftSideImageCroppedUrl) &&
      (rightSideImageCropped || imagesUrls.rightSideImageCroppedUrl)
    ) {
      return textArrayWithBothCroppedImage;
    } else if (leftSideImageCropped || imagesUrls.leftSideImageCroppedUrl) {
      return textArrayWithCroppedImageLeft;
    } else if (rightSideImageCropped || imagesUrls.rightSideImageCroppedUrl) {
      return textArrayWithCroppedImageRight;
    } else {
      return defaultTextArray;
    }
  })();

  const buttonStyle =
    "text-black bg-white dark:bg-[#3b3b3b] dark:text-white rounded-full border-2 border-black/60 dark:border-white/70 hover:bg-black/80 hover:text-white hover:dark:text-black hover:dark:bg-white ";

  const buttonVisible = shouldShowButton(
    currentTextIndex,
    selectedColors,
    isColorChanging,
    textArray
  );

  /////////Functions//////////

  const handleChangeTextLeft = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSideText({
      ...sideText,
      leftText: newValue,
    });

    setSideView("left");
  };

  const handleChangeTextRight = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;

    setSideText({
      ...sideText,
      rightText: newValue,
    });
    setSideView("right"); // Aktualizacja stanu po zmianie wartości pola tekstowego
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
    if (
      [
        "tip_1",
        "quarter_1",
        "swoosh_1",
        "heel_1",
        "heel_logo",
        "toe",
        "eyestay_1",
      ].includes(textArray[currentTextIndex])
    ) {
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

  async function deleteCustomImages(id: any) {
    const projectName = props.param;
    let customImagesFolderRef;

    if (props.param) {
      customImagesFolderRef = ref(
        storage,
        `designProject/${user?._id}/${projectName}`
      );
    } else {
      customImagesFolderRef = ref(storage, `customImages/${id}`);
    }

    const avatarFilesList = await listAll(customImagesFolderRef);

    const deletePromises = avatarFilesList.items
      .filter((item) => {
        if (deleteLeftImage && deleteRightImage) {
          // Jeśli oba URL-i istnieją, usuwaj tylko pliki, które zaczynają się od "left" lub "right"
          return item.name.startsWith(`left`) || item.name.startsWith(`right`);
        } else if (deleteLeftImage) {
          // Jeśli istnieje tylko leftSideImageCroppedUrl, usuwaj tylko pliki, które zaczynają się od "left"
          return item.name.startsWith(`left`);
        } else if (deleteRightImage) {
          // Jeśli istnieje tylko rightSideImageCroppedUrl, usuwaj tylko pliki, które zaczynają się od "right"
          return item.name.startsWith(`right`);
        }
        // Jeśli żadne z URL-i nie istnieje, nie usuwaj żadnych plików
        return false;
      })
      .map((item) => deleteObject(item));

    await Promise.all(deletePromises);
  }

  const saveDesign = async () => {
    const userId = user ? user._id : "";
    const projectName = props.param;

    if (props.param) {
      const customContextData = {
        selectedColors,
        selectedColorsText,
        selectedPatches,
        swooshVisibility,
        sideText,
      };

      setLoading(true);

      try {
        const response = await axios.post(`/saveSpecificProject`, {
          customContextData,
          userId,
          projectName,
        });

        // Usuń pliki
        await deleteCustomImages(response.data.id);

        if (leftSideImageCropped) {
          const storageRef = ref(
            storage,
            `designProject/${user?._id}/${projectName}/left_${leftSideImageCropped.name}`
          );
          await uploadBytes(storageRef, leftSideImageCropped);
        }
        if (rightSideImageCropped) {
          const storageRef = ref(
            storage,
            `designProject/${user?._id}/${projectName}/right_${rightSideImageCropped.name}`
          );
          await uploadBytes(storageRef, rightSideImageCropped);
        }
      } catch (error) {
        const text = t("shop.error");
        setErrorsServer(text);
      }

      setImagesUrls({
        leftSideImageCroppedUrl: "",
        rightSideImageCroppedUrl: "",
      });
      setLeftSideImageCropped(null);
      setRightSideImageCropped(null);
      setLoading(false);
      navigate("/myProjects");
    } else {
      const customContextData = {
        selectedColors,
        selectedColorsText,
        selectedPatches,
        swooshVisibility,
        sideText,
      };

      setLoading(true);

      try {
        const response = await axios.post(`/saveCustomShoeTemporary`, {
          customContextData,
          userId,
        });

        // Usuń pliki
        await deleteCustomImages(response.data.id);

        if (leftSideImageCropped) {
          const storageRef = ref(
            storage,
            `customImages/${response.data.id}/left_${leftSideImageCropped.name}`
          );
          await uploadBytes(storageRef, leftSideImageCropped);
        }
        if (rightSideImageCropped) {
          const storageRef = ref(
            storage,
            `customImages/${response.data.id}/right_${rightSideImageCropped.name}`
          );
          await uploadBytes(storageRef, rightSideImageCropped);
        }
      } catch (error) {
        const text = t("shop.error");
        setErrorsServer(text);
      }

      setLoading(false);
      window.location.reload();
    }
  };

  const closeDesign = () => {
    if (props.param) {
      setLeftSideImageCropped(null);
      setRightSideImageCropped(null);
      navigate("/myProjects");
    } else {
      window.location.reload();
    }
  };

  const handleZoomChange = (event: any) => {
    setZoom(event.target.value);
  };

  const onCropComplete = (
    croppedAreaPercentage: any,
    croppedAreaPixels: any
  ) => {
    setCroppedArea(croppedAreaPixels);
  };

  const processImage = async (
    image: any,
    setCroppedImage: (file: any) => void,
    setImage: (image: any) => void,
    area: any,
    side: string
  ) => {
    try {
      if (!image || !area) {
        return null;
      }

      const croppedImageFile: File = await getCroppedImageFile(image, area);

      setCroppedImage(croppedImageFile);

      setSideView(side);
      setImage("");
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  const deleteImageCropped = (
    setImageCropped: any,
    setIsSwooshVisible: any,
    side: string
  ) => {
    setIsSwooshVisible(true);

    if (side === "left") {
      setImagesUrls({
        ...imagesUrls,
        leftSideImageCroppedUrl: "",
      });

      setDeleteLeftImage(true);

      setSwooshVisibility({
        ...swooshVisibility,
        isLeftSwooshVisible: true,
      });
    }

    if (side === "right") {
      setDeleteRightImage(true);

      setImagesUrls({
        ...imagesUrls,
        rightSideImageCroppedUrl: "",
      });

      setSwooshVisibility({
        ...swooshVisibility,
        isRightSwooshVisible: true,
      });
    }
    setImageCropped(null);
  };

  /////////UseEffects///////////

  useEffect(() => {
    changeColorToRed(
      selectedColors,
      setSelectedColors,
      currentTextIndex,
      textArray
    );
    setIsColorChanging(true);

    setTimeout(() => {
      setIsColorChanging(false);
    }, 500);
  }, [currentTextIndex]);

  useEffect(() => {
    if (!sideText.rightText || !sideText.leftText) {
      const updatedColors = { ...selectedColorsText };

      if (!sideText.rightText) {
        updatedColors.selectedColorRightText = { rgb: { r: 0, g: 0, b: 0 } };
      }

      if (!sideText.leftText) {
        updatedColors.selectedColorLeftText = { rgb: { r: 0, g: 0, b: 0 } };
      }

      setSelectedColorsText(updatedColors);
    }
  }, [sideText.rightText, sideText.leftText]);

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

  return (
    <>
      <div className="flex justify-center items-center">
        {errorsServer && (
          <InfoDivBottom color="bg-red-500" text={errorsServer} />
        )}
      </div>

      {showPatchesDiv === "left" && (
        <PatchesDiv
          setShowDiv={setShowPatchesDiv}
          setPatche={(patchName) =>
            setSelectedPatches({
              ...selectedPatches,
              selectedLeftPatch: patchName,
            })
          }
          setSideView={setSideView}
          side="left"
        />
      )}

      {showPatchesDiv === "right" && (
        <PatchesDiv
          setShowDiv={setShowPatchesDiv}
          setPatche={(patchName) =>
            setSelectedPatches({
              ...selectedPatches,
              selectedRightPatch: patchName,
            })
          }
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
        <ColoPickerTextDiv
          setShowDiv={setShowColorPicker}
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
          submit={() =>
            processImage(
              leftSideImage,
              setLeftSideImageCropped,
              setLeftSideImage,
              croppedArea,
              "left"
            )
          }
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
          submit={() =>
            processImage(
              rightSideImage,
              setRightSideImageCropped,
              setRightSideImage,
              croppedArea,
              "right"
            )
          }
        />
      )}

      {isDivBackVisible && (
        <div className="bg-black/50 backdrop-blur-sm fixed w-full h-screen z-20 flex justify-center items-center ">
          <div className="bg-white rounded-lg w-[45rem] text-center py-8">
            <p className="text-3xl text-black">{t("designSection.text24")}</p>
            <p className="text-2xl text-black/80 mt-4">
              {t("designSection.text25")}
            </p>

            <div className="flex justify-center items-center space-x-10 mt-10">
              <button
                onClick={() => setIsDivBackVisible(!isDivBackVisible)}
                className="border-2 border-black/80 rounded-full px-10 py-3 hover:bg-black/80 hover:text-white"
              >
                <p className="text-lg">{t("designSection.text27")}</p>
              </button>

              <button
                onClick={closeDesign}
                className="border-2 border-black/80 rounded-full  px-10 py-3 hover:bg-black/80 hover:text-white"
              >
                <p className="text-lg">{t("designSection.text26")}</p>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className=" min-h-screen bg-white dark:bg-[#3b3b3b]">
        <div className="flex justify-center pt-6 px-10 lg:px-20  xl:px-0 xl:absolute top-10 2xl:top-4 left-10 z-10 space-x-10 2xl:space-x-[10rem]">
          <div className="flex justify-center space-x-20 xl:space-x-4">
            <button
              onClick={() => setIsDivBackVisible(!isDivBackVisible)}
              className={`px-8 py-3 ${buttonStyle} `}
            >
              <p className="text-lg">{t("designSection.text1")}</p>
            </button>

            <button
              onClick={saveDesign}
              disabled={loading}
              className={`px-8 py-3 bg-black/80 dark:bg-white/80 disabled:bg-[#c9c9c9] text-white dark:text-black rounded-full ${!loading ? "hover:bg-black hover:dark:bg-white" : ""
                }`}
            >
              <div className="flex items-center justify-center">
                {loading && (
                  <CircleSvg
                    color={theme === "dark" ? "black" : "white"}
                    secColor={theme === "dark" ? "black" : "white"}
                  />
                )}
                <p className="text-lg">{t("designSection.text2")}</p>
              </div>
            </button>
          </div>
          <div className="hidden xl:flex xl:w-[20rem] 2xl:w-[24rem]  mx-auto justify-between items-center text-black dark:text-white">
            <AiOutlineArrowLeft
              size={30}
              className="cursor-pointer"
              onClick={handlePreviousText}
            />

            <div className="flex space-x-2 text-xl font-medium">
              <p className=" text-black dark:text-white">
                {t(`textArrayCustom.${textArray[currentTextIndex]}`)}
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

        <div className="flex flex-col xl:flex-row items-center justify-center  bg-white dark:bg-[#3b3b3b] xl:h-[50rem] border-b-2 border-black/20 dark:border-white/30">
          <div className="flex  justify-center items-center xl:w-[50%] 2xl:w-[60%]  xl:border-r-2 border-black/20 dark:border-white/30 xl:h-[50rem] ">
            <div className="flex justify-center items-center mt-6 md:w-[30rem] md:h-[25rem] xl:pr-10 ">
              <div className="relative md:scale-[130%] xl:scale-[160%] 2xl:scale-[200%]">
                <img
                  className="h-[17rem] rounded-xl"
                  src={renderImageSource()}
                />

                <>
                  <CloudinaryContext cloudName="dlrhphkcb">
                    {[
                      "tip_1",
                      "quarter_1",
                      "swoosh_1",
                      "heel_1",
                      "heel_logo",
                      "toe",
                      "eyestay_1",
                    ].includes(textArray[currentTextIndex]) ? (
                      <>
                        <img
                          src={
                            leftSideImageCropped
                              ? URL.createObjectURL(leftSideImageCropped)
                              : imagesUrls.leftSideImageCroppedUrl
                                ? imagesUrls.leftSideImageCroppedUrl
                                : ""
                          }
                          className="h-[8rem]  absolute top-[4.7rem] left-[10.3rem] opacity-80"
                        />
                        <img
                          src={side_left}
                          className="h-[17rem] rounded-xl absolute top-0 left-0 "
                        />
                        {!imagesUrls.leftSideImageCroppedUrl &&
                          !leftSideImageCropped && (
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
                            opacity={
                              imagesUrls.leftSideImageCroppedUrl ||
                                leftSideImageCropped
                                ? "opacity-100"
                                : "opacity-70"
                            }
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
                            <p
                              className="text-xs"
                              style={{
                                color: `rgb(${selectedColorsText.selectedColorLeftText.rgb.r}, ${selectedColorsText.selectedColorLeftText.rgb.g}, ${selectedColorsText.selectedColorLeftText.rgb.b})`,
                              }}
                            >
                              {sideText.leftText}
                            </p>
                          </div>
                        )}
                        {renderPatch(
                          selectedPatches.selectedLeftPatch,
                          "absolute bottom-[6.8rem] right-[3rem] max-w-[3rem] max-h-[2rem] opacity-90",
                          props.patches
                        )}
                      </>
                    ) : (
                      <>
                        <img
                          src={
                            rightSideImageCropped
                              ? URL.createObjectURL(rightSideImageCropped)
                              : imagesUrls.rightSideImageCroppedUrl
                                ? imagesUrls.rightSideImageCroppedUrl
                                : ""
                          }
                          className="h-[8rem] absolute top-[4.7rem] left-[1.7rem] opacity-80"
                        />
                        <img
                          src={side_right}
                          className="h-[17rem] rounded-xl absolute top-0 left-0 "
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
                        {!imagesUrls.rightSideImageCroppedUrl &&
                          !rightSideImageCropped && (
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
                            opacity={
                              imagesUrls.rightSideImageCroppedUrl ||
                                rightSideImageCropped
                                ? "opacity-100"
                                : "opacity-70"
                            }
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
                            >
                              {sideText.rightText}
                            </p>
                          </div>
                        )}
                        {renderPatch(
                          selectedPatches.selectedRightPatch,
                          "absolute bottom-[7rem] left-[3rem] max-w-[3rem] max-h-[2rem]  opacity-90",
                          props.patches
                        )}
                      </>
                    )}
                  </CloudinaryContext>
                </>
              </div>
            </div>
          </div>

          <div className="flex xl:hidden w-[24rem]  mx-auto justify-between items-center  mt-10 text-black dark:text-white">
            <AiOutlineArrowLeft
              size={30}
              className="cursor-pointer"
              onClick={handlePreviousText}
            />

            <div className="flex space-x-2 text-xl font-medium">
              <p className=" text-black dark:text-white">
                {t(`textArrayCustom.${textArray[currentTextIndex]}`)}
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

          <div className=" mt-10 pb-16 xl:pb-0 h-[45rem] px-10 ">
            <div className="flex justify-center space-x-4">
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
                <p className="text-xl ">{t("designSection.text3")}</p>

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

                <p className="text-xl mt-10 ">{t("designSection.text4")}</p>

                <div className="flex space-x-10 items-center">
                  <ChromePicker
                    color={getCurrentColor(
                      currentTextIndex,
                      selectedColors,
                      textArray
                    )}
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
                    onClick={() =>
                      handleDeleteColor(
                        currentTextIndex,
                        selectedColors,
                        setSelectedColors,
                        textArray
                      )
                    }
                    className={`px-4 h-[3.5rem] ${buttonStyle} `}
                  >
                    <p className="text-xl">{t("designSection.text5")}</p>
                  </button>
                </div>
              </div>
            )}

            {selectedType === 1 && (
              <div className="flex flex-col mt-6 ">
                <div className="flex flex-col mt-6">
                  <p className="text-xl text-black dark:text-white ">
                    {t("designSection.text7")}{" "}
                    <span className="text-red-500">
                      {t("designSection.text8")}
                    </span>{" "}
                    {t("designSection.text9")}
                  </p>
                  <input
                    type="text"
                    value={sideText.leftText}
                    maxLength={12}
                    onChange={handleChangeTextLeft}
                    className="mt-2 w-full px-2 h-[4rem] text-xl bg-white dark:bg-white/70 border-2 border-black/50 rounded-lg outline-none"
                  ></input>
                  <p className="text-lg mt-2 text-black/60 dark:text-white/60">
                    {t("designSection.text10")}
                  </p>

                  {sideText.leftText && (
                    <div className="flex items-center mt-10 space-x-8">
                      <p className="text-xl text-black dark:text-white ">
                        {t("designSection.text12")}
                      </p>
                      <div
                        onClick={() => setShowColorPicker("left")}
                        className="cursor-pointer rounded-lg h-[2rem] w-[4rem] bg-black"
                        style={{
                          backgroundColor: `rgb(${selectedColorsText.selectedColorLeftText.rgb.r}, ${selectedColorsText.selectedColorLeftText.rgb.g}, ${selectedColorsText.selectedColorLeftText.rgb.b})`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>
                <div className="h-[2px] w-full bg-black/30 dark:bg-white/50 mt-10"></div>
                <div className="flex flex-col mt-6">
                  <p className="text-xl text-black dark:text-white ">
                    {t("designSection.text7")}{" "}
                    <span className="text-red-500">
                      {t("designSection.text11")}
                    </span>{" "}
                    {t("designSection.text9")}
                  </p>
                  <input
                    type="text"
                    value={sideText.rightText}
                    maxLength={12}
                    onChange={handleChangeTextRight}
                    className="mt-2 w-full px-2 h-[4rem] text-xl bg-white dark:bg-white/70 border-2 border-black/50 rounded-lg outline-none"
                  ></input>
                  <p className="text-lg mt-2 text-black/60 dark:text-white/60">
                    {t("designSection.text10")}
                  </p>

                  {sideText.rightText && (
                    <div className="flex items-center mt-10 space-x-8">
                      <p className="text-xl text-black dark:text-white ">
                        {t("designSection.text12")}
                      </p>
                      <div
                        onClick={() => setShowColorPicker("right")}
                        className="cursor-pointer rounded-lg h-[2rem] w-[4rem]"
                        style={{
                          backgroundColor: `rgb(${selectedColorsText.selectedColorRightText.rgb.r}, ${selectedColorsText.selectedColorRightText.rgb.g}, ${selectedColorsText.selectedColorRightText.rgb.b})`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedType === 2 && (
              <div className="flex flex-col mt-10 ">
                <p className="text-xl text-black dark:text-white ">
                  {t("designSection.text14")}{" "}
                  <span className="text-red-500">
                    {t("designSection.text8")}
                  </span>{" "}
                  {t("designSection.text9")}
                </p>

                <div className="flex items-center mt-6">
                  {!leftSideImageCropped &&
                    !imagesUrls.leftSideImageCroppedUrl ? (
                    <label
                      className={`py-2 px-4 border-2 cursor-pointer text-base ${buttonStyle} `}
                    >
                      {t("designSection.text15")}
                      <input
                        type="file"
                        name="left_side_graphicDesign"
                        accept="image/jpeg, image/jpg"
                        className="hidden"
                        onChange={(event) =>
                          onSelectFile(event, setLeftSideImage)
                        }
                      />
                    </label>
                  ) : (
                    <>
                      <img
                        src={
                          imagesUrls.leftSideImageCroppedUrl
                            ? imagesUrls.leftSideImageCroppedUrl
                            : leftSideImageCropped
                              ? URL.createObjectURL(leftSideImageCropped)
                              : ""
                        }
                        className="h-[5rem] rounded-lg"
                      />
                      <div
                        onClick={() => {
                          deleteImageCropped(
                            setLeftSideImageCropped,
                            setSwooshVisibility,
                            "left"
                          );
                          setSideView("left");
                        }}
                        className="flex items-center ml-4 cursor-pointer text-balck/80 dark:text-white/80"
                      >
                        <AiOutlineClose size={25} />
                        <p className="text-xl ">{t("designSection.text16")}</p>
                      </div>
                    </>
                  )}
                </div>

                <p className="text-xl text-black dark:text-white mt-10">
                  {t("designSection.text14")}{" "}
                  <span className="text-red-500">
                    {t("designSection.text11")}
                  </span>{" "}
                  {t("designSection.text9")}
                </p>

                <div className="flex items-center mt-6">
                  {!rightSideImageCropped &&
                    !imagesUrls.rightSideImageCroppedUrl ? (
                    <label
                      className={`py-2 px-4 border-2 cursor-pointer text-base ${buttonStyle} `}
                    >
                      {t("designSection.text15")}
                      <input
                        type="file"
                        name="right_side_graphicDesign"
                        accept="image/jpeg, image/jpg"
                        className="hidden"
                        onChange={(event) =>
                          onSelectFile(event, setRightSideImage)
                        }
                      />
                    </label>
                  ) : (
                    <>
                      <img
                        src={
                          imagesUrls.rightSideImageCroppedUrl
                            ? imagesUrls.rightSideImageCroppedUrl
                            : rightSideImageCropped
                              ? URL.createObjectURL(rightSideImageCropped)
                              : ""
                        }
                        className="h-[5rem] rounded-lg"
                      />
                      <div
                        onClick={() => {
                          deleteImageCropped(
                            setRightSideImageCropped,
                            setSwooshVisibility,
                            "right"
                          );
                          setSideView("right");
                        }}
                        className="flex items-center ml-4 cursor-pointer text-balck/80 dark:text-white/80"
                      >
                        <AiOutlineClose size={25} />
                        <p className="text-xl">{t("designSection.text16")}</p>
                      </div>
                    </>
                  )}
                </div>

                {(leftSideImageCropped ||
                  imagesUrls.leftSideImageCroppedUrl) && (
                    <div className="flex items-center mt-10">
                      <p className="text-xl text-black/80 dark:text-white/80 ">
                        {t("designSection.text17")}
                      </p>
                      <ToogleButtonSwosh
                        isSwooshVisible={swooshVisibility.isLeftSwooshVisible}
                        setIsSwooshVisible={setSwooshVisibility}
                        side="left"
                        setSideView={setSideView}
                        swooshVisibility={swooshVisibility}
                      />
                    </div>
                  )}

                {(rightSideImageCropped ||
                  imagesUrls.rightSideImageCroppedUrl) && (
                    <div className="flex items-center mt-10">
                      <p className="text-xl text-black/80 dark:text-white/80">
                        {t("designSection.text18")}
                      </p>
                      <ToogleButtonSwosh
                        isSwooshVisible={swooshVisibility.isRightSwooshVisible}
                        setIsSwooshVisible={setSwooshVisibility}
                        side="right"
                        setSideView={setSideView}
                        swooshVisibility={swooshVisibility}
                      />
                    </div>
                  )}
              </div>
            )}

            {selectedType === 3 && (
              <div className="flex flex-col mt-10">
                <p className="text-xl text-black dark:text-white">
                  {t("designSection.text19")}{" "}
                  <span className="text-red-500">
                    {t("designSection.text8")}
                  </span>{" "}
                  {t("designSection.text9")}
                </p>

                {!selectedPatches.selectedLeftPatch ? (
                  <div className="flex items-center mt-6">
                    <button
                      onClick={() => setShowPatchesDiv("left")}
                      className={`py-2 px-4 border-2 cursor-pointer text-base ${buttonStyle} `}
                    >
                      <p>{t("designSection.text20")}</p>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center mt-8">
                    {renderPatch(
                      selectedPatches.selectedLeftPatch,
                      "max-w-[6rem] max-h-[5rem]",
                      props.patches
                    )}
                    <div
                      onClick={() => {
                        setSelectedPatches({
                          ...selectedPatches,
                          selectedLeftPatch: "",
                        });
                        setSideView("left");
                      }}
                      className="flex items-center ml-4 cursor-pointer text-black/80 dark:text-white/80"
                    >
                      <AiOutlineClose size={25} />
                      <p className="text-xl">{t("designSection.text21")}</p>
                    </div>
                  </div>
                )}

                <p className="text-xl text-black dark:text-white mt-10">
                  {t("designSection.text19")}{" "}
                  <span className="text-red-500">
                    {t("designSection.text11")}
                  </span>{" "}
                  {t("designSection.text9")}
                </p>

                {!selectedPatches.selectedRightPatch ? (
                  <div className="flex items-center mt-6">
                    <button
                      onClick={() => setShowPatchesDiv("right")}
                      className={`py-2 px-4 border-2 cursor-pointer text-base ${buttonStyle} `}
                    >
                      <p>{t("designSection.text20")}</p>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center mt-8">
                    {renderPatch(
                      selectedPatches.selectedRightPatch,
                      "max-w-[6rem] max-h-[5rem]",
                      props.patches
                    )}
                    <div
                      onClick={() => {
                        setSelectedPatches({
                          ...selectedPatches,
                          selectedRightPatch: "",
                        });
                        setSideView("right");
                      }}
                      className="flex items-center ml-4 cursor-pointer text-black/80 dark:text-white/80"
                    >
                      <AiOutlineClose size={25} />
                      <p className="text-xl">{t("designSection.text21")}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DesignSection;
