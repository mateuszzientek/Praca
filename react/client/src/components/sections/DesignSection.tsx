import React, { useState, useEffect, useContext } from "react";
import { IoColorFillOutline, IoTextOutline } from "react-icons/io5";
import { BsFlower1 } from "react-icons/bs";
import {
  AiOutlinePicture,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
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
  handleDeleteColor

} from "../../colorsUtlils";

interface DesignSectionProps {
  onDesignFinish: () => void;
  photos: string[];
  patches: { url: string; name: string }[];
}

function DesignSection(props: DesignSectionProps) {
  const [isColorChanging, setIsColorChanging] = useState(false);
  const [selectedType, setSelectedType] = useState<number | null>(0);
  const { selectedColors, setSelectedColors } = useContext(CustomContext);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const textArray = [
    "Tip",
    "Quarter",
    "Swoosh",
    "Heel",
    "Heel Logo",
    "Eyestay",
    "Toe",
    "Second Quarter",
    "Second Swoosh",
    "Second Heel",
  ];

  const buttonStyle = "text-black bg-white dark:bg-[#3b3b3b] dark:text-white rounded-full border-2 border-black/60 dark:border-white/70 hover:bg-black/80 hover:text-white hover:dark:text-black hover:dark:bg-white "


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
    if (currentTextIndex < 7) {
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
    changeColorToRed(selectedColors, setSelectedColors, currentTextIndex);
    setIsColorChanging(true);

    setTimeout(() => {
      // Po określonym czasie ustaw isColorChanging z powrotem na false
      setIsColorChanging(false);
    }, 500);
  }, [currentTextIndex]);

  const buttonVisible = shouldShowButton(currentTextIndex, selectedColors, isColorChanging);

  return (
    <div className="w-full ">
      <button
        onClick={props.onDesignFinish}
        className={`absolute top-10 left-10 z-10 px-2 py-3 ${buttonStyle} `}
      >
        <p className="text-lg">Finish Editing</p>
      </button>

      <div className="flex bg-white dark:bg-[#3b3b3b] h-[45rem] border-b-2 border-black/20 dark:border-white/30">
        <div className="flex justify-center items-center w-[70%] border-r-2 border-black/20 dark:border-white/30">
          <div className="relative">
            <img
              id="car1"
              className="h-[35rem] rounded-xl"
              src={renderImageSource()}
            />

            <>
              <CloudinaryContext cloudName="dlrhphkcb">
                {currentTextIndex < 7 ? (
                  <>
                    <TransformedImage
                      publicId="elements/quarter_1_ycvbpt.png"
                      rgb={selectedColors.selectedColorQuarter_1.rgb}
                    />
                    <TransformedImage
                      publicId="elements/tip_1_jxccem.png"
                      rgb={selectedColors.selectedColorTip_1.rgb}
                    />
                    <TransformedImage
                      publicId="elements/hill_1_h370h8.png"
                      rgb={selectedColors.selectedColorHill_1.rgb}
                    />
                    <TransformedImage
                      publicId="elements/swosh_1_pxffyd.png"
                      rgb={selectedColors.selectedColorSwosh_1.rgb}
                    />
                    <TransformedImage
                      publicId="elements/heel_logo_1_nowlsy.png"
                      rgb={selectedColors.selectedColorHeel_logo_1.rgb}
                    />
                    <TransformedImage
                      publicId="elements/toe_1_uz2weu.png"
                      rgb={selectedColors.selectedColorToe_1.rgb}
                    />
                    <TransformedImage
                      publicId="elements/Eyestay_1_z5b6jc.png"
                      rgb={selectedColors.selectedColorEyestay_1.rgb}
                    />
                  </>
                ) : (
                  <>
                    <TransformedImage
                      publicId="elements/toe_2_enco6w.png"
                      rgb={selectedColors.selectedColorToe_1.rgb}
                    />
                    <TransformedImage
                      publicId="elements/tip_2_bmjg7i.png"
                      rgb={selectedColors.selectedColorTip_1.rgb}
                    />
                    <TransformedImage
                      publicId="elements/quarter_2_kjcplp.png"
                      rgb={selectedColors.selectedColorQuarter_2.rgb}
                    />
                    <TransformedImage
                      publicId="elements/heel_2_xtnwp2.png"
                      rgb={selectedColors.selectedColorHeel_2.rgb}
                    />
                    <TransformedImage
                      publicId="elements/swosh_2_twgxvt.png"
                      rgb={selectedColors.selectedColorSwosh_2.rgb}
                    />
                    <TransformedImage
                      publicId="elements/heel_logo_2_j4oj49.png"
                      rgb={selectedColors.selectedColorHeel_logo_1.rgb}
                    />
                    <TransformedImage
                      publicId="elements/eyestay_2_ciar70.png"
                      rgb={selectedColors.selectedColorEyestay_1.rgb}
                    />
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
                        setSelectedColors
                      )
                    }
                    isSelected={isColorSelected(
                      currentTextIndex, // Aktualny indeks
                      selectedColors, // Obiekt z wybranymi kolorami
                      color.color // Kolor do sprawdzenia
                    )}
                  />
                ))}
              </div>

              <p className="text-xl mt-10 ">Wybierz swój własny kolor</p>

              <div className="flex space-x-10 items-center">
                <ChromePicker
                  color={getCurrentColor(currentTextIndex, selectedColors)}
                  onChange={
                    (newColor: any) =>
                      handleColorChange(
                        newColor,
                        currentTextIndex,
                        selectedColors,
                        setSelectedColors
                      ) // Użyj handleColorChange z odpowiednimi argumentami
                  }
                  className="mt-6"
                />

                <button
                  style={{ display: buttonVisible ? "block" : "none" }}
                  onClick={() => handleDeleteColor(currentTextIndex, selectedColors, setSelectedColors)}
                  className={`px-4 h-[3.5rem] ${buttonStyle} `}>
                  <p className="text-xl">Usuń kolor</p>
                </button>
              </div>

            </div>
          )}

          {selectedType === 1 && (
            <div className="flex flex-col mt-10 ">
              <p className="text-xl text-black dark:text-white ">Wpisz tekst</p>

              <input
                type="text"
                maxLength={6}
                className="mt-4 w-full px-2 h-[4rem] text-xl bg-white dark:bg-white/70 border-2 border-black/50 rounded-lg outline-none"
              ></input>
              <p className="text-lg mt-2 text-black/60 dark:text-white/60">
                Możesz wpisać do 6 znaków
              </p>

              <p className="text-xl mt-10 text-black dark:text-white">
                Ustaw kolor tekstu
              </p>

              <ChromePicker className="mt-6" />
            </div>
          )}

          {selectedType === 3 && (
            <div className="flex flex-col mt-10">
              <p className="text-xl text-black dark:text-white">
                Wybierz naszywkę
              </p>

              <div className="flex flex-wrap w-[28rem]  items-center">
                {props.patches.map((patch, index) => (
                  <LazyLoadImage
                    key={patch.name}
                    alt="Patche"
                    className={`h-[5rem] mr-6 mt-6 cursor-pointer hover:scale-105 `}
                    src={patch.url}
                    effect="blur"
                    placeholderSrc={patch.url}
                  />
                ))}
              </div>
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
  );
}

export default DesignSection;
