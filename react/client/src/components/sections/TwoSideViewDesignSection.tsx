import React, { useContext, useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { ProjectItem } from "src/types";
import { CloudinaryContext } from "cloudinary-react";
import TransformedImage from "../elements/TransformedImage";
import renderPatch from "src/resources/renderPatch";
import side_left from "../../assets/images/side_left.png";
import side_right from "../../assets/images/side_right.png";
import { CustomContext } from "../elements/CustomProvider";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import storage from "../../resources/firebase";
import { UserContext } from "../elements/UserProvider";
import { useTranslation } from "react-i18next";
import LoadingAnimationSmall from "../elements/LoadingAnimatonSmall";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomShoesOrder from "./CustomShoesOrder";
import { ThemeContext } from "../elements/ThemeContext";

interface TwoSideViewDesignSectionProps {
  setShowDiv: (show: boolean) => void;
  project: ProjectItem | null;
  setError: (error: string) => void;
}

function TwoSideViewDesignSection(props: TwoSideViewDesignSectionProps) {
  const {
    setSelectedColors,
    setSwooshVisibility,
    setSelectedColorsText,
    setSideText,
    setSelectedPatches,
    setImagesUrls,
    imagesUrls,
    patches,
    photos,
  } = useContext(CustomContext);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [imageUrlLeft, setImageUrlLeft] = useState("");
  const [imageUrlRight, setImageUrlRight] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDiv, setShowDiv] = useState(false);
  const [showCustomShoesOrder, setShowCustomShoesOrder] = useState(false);
  const [showSelectSize, setShowSelectSize] = useState(false);
  const sizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];
  const currentCode = localStorage.getItem("i18nextLng");
  const [selectedSize, setSelectedSize] = useState("");

  const buttonStyle =
    "px-4  py-3 text-black  dark:text-white rounded-full border-2 border-black/60 dark:border-white/70 hover:bg-black/80 hover:text-white hover:dark:text-black hover:dark:bg-white ";

  const handleChangeSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSize(event.target.value);
    setShowSelectSize(false);
    setShowCustomShoesOrder(true);
  };

  useEffect(() => {
    if (showDiv || showSelectSize) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up the effect
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showDiv, showSelectSize]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStorageRef = ref(
          storage,
          `/designProject/${user?._id}/${props.project?.designName}`
        );

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
        const text = t("customization.text12");
        props.setError(text);
      }
    };
    fetchData();
    setIsReady(true);
    setTimeout(() => {
      setIsLoading(false); // Wyłącz animację ładowania po 2 sekundach
    }, 1000);
  }, []);

  const handleDeleteProject = () => {
    axios
      .delete(`/deleteProject/${user?._id}/${props.project?._id}`)
      .then((response) => {
        console.log("Projekt został usunięty z bazy danych");
        window.location.reload();
      })
      .catch((error) => {
        const text = t("customization.text12");
        props.setError(text);
      });
  };

  const handleEdit = () => {
    const fetchData = async () => {
      try {
        const userId = user ? user._id : "";
        const response = await axios.get(
          `/getSpecificProject?userId=${userId}&projectName=${props.project?.designName}`
        );
        const project = response.data.project;

        setSelectedColors(project.selectedColors);
        setSelectedColorsText(project.selectedColorsText);
        setSelectedPatches(project.selectedPatches);
        setSwooshVisibility(project.swooshVisibility);
        setSideText(project.sideText);

        const userStorageRef = ref(
          storage,
          `/designProject/${userId}/${props.project?.designName}`
        );

        const data = await listAll(userStorageRef);

        if (data.items.length > 0) {
          const userImages = data.items;
          const leftImages = userImages.filter((item) =>
            item.name.startsWith("left")
          );
          const rightImages = userImages.filter((item) =>
            item.name.startsWith("right")
          );

          const updatedImagesUrls = { ...imagesUrls };

          if (leftImages.length > 0) {
            const leftImageRef = leftImages[0];
            const leftImageURL = await getDownloadURL(leftImageRef);
            updatedImagesUrls.leftSideImageCroppedUrl = leftImageURL;
          } else {
            updatedImagesUrls.leftSideImageCroppedUrl = "";
          }

          if (rightImages.length > 0) {
            const rightImageRef = rightImages[0];
            const rightImageURL = await getDownloadURL(rightImageRef);
            updatedImagesUrls.rightSideImageCroppedUrl = rightImageURL;
          } else {
            updatedImagesUrls.rightSideImageCroppedUrl = "";
          }

          setImagesUrls(updatedImagesUrls);
        } else {
          setImagesUrls({
            leftSideImageCroppedUrl: "",
            rightSideImageCroppedUrl: "",
          });
          console.log("Folder nie istnieje");
        }
      } catch (error) {
        const text = t("customization.text12");
        props.setError(text);
        console.error("Błąd podczas pobierania danych", error);
      }
    };
    fetchData();
    navigate(`/customization/${props.project?.designName}`);
  };

  return (
    <>
      {showCustomShoesOrder && (
        <CustomShoesOrder
          setShowMainDiv={setShowCustomShoesOrder}
          project={props.project}
          size={selectedSize}
        />
      )}

      {showSelectSize && (
        <div className="fixed bg-black/40 w-full h-screen z-[70] flex justify-center items-center backdrop-blur-sm overflow-y-auto min-h-screen ">
          <div className="relative flex flex-col items-center justify-center  bg-white dark:bg-black rounded-lg p-10 overflow-y-auto max-h-[80vh] ">
            <div className="w-full max-h-[80vh] ">
              <div className="flex justify-between items-center pb-4">
                <p className="text-2xl text-black ">Wybierz rozmiar</p>
                <AiOutlineClose
                  size={25}
                  onClick={() => setShowSelectSize(!showSelectSize)}
                  color={theme === "dark" ? "white" : "black"}
                  className="cursor-pointer hover:scale-125"
                />
              </div>
              <div className="grid grid-cols-3 xl:grid-cols-4 mt-2 mb-4 gap-y-2 gap-x-2">
                {sizes.map((size) => (
                  <label key={size} className="cursor-pointer">
                    <input
                      type="radio"
                      className="peer sr-only"
                      name="sizeChoice2"
                      value={size}
                      onChange={handleChangeSize}
                    />
                    <div
                      className={` flex justify-center space-x-1 items-center rounded  w-[5rem] h-[3rem] text-black/80 dark:text-white  shadow-md 
                    bg-[#ebebeb] dark:bg-black/30 transition-all active:scale-95 peer-checked:bg-[#97DEFF] peer-checked:text-black/80"
                      } `}
                    >
                      <p>{currentCode !== "pl" ? "US" : "EU"}</p>
                      <p>{t(`sizes.${size}`)}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showDiv && (
        <div className="bg-black/50 backdrop-blur-sm fixed w-full h-screen z-30 flex justify-center items-center min-h-screen overflow-y-auto">
          <div className="bg-white rounded-lg w-[45rem] text-center py-8 max-h-[80vh] overflow-y-auto">
            <p className="text-3xl text-black">{t("myProjects.text8")}</p>
            <p className="text-2xl text-black/80 mt-4">
              {t("myProjects.text9")}
            </p>

            <div className="flex justify-center items-center space-x-10 mt-10">
              <button
                onClick={() => setShowDiv(!showDiv)}
                className="border-2 border-black/80 rounded-full px-10 py-3 hover:bg-black/80 hover:text-white"
              >
                <p className="text-lg">{t("designSection.text27")}</p>
              </button>

              <button
                onClick={handleDeleteProject}
                className="border-2 border-black/80 rounded-full  px-10 py-3 hover:bg-black/80 hover:text-white"
              >
                <p className="text-lg">{t("designSection.text26")}</p>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-black/50 backdrop-blur-sm fixed w-full h-screen z-20 flex justify-center items-center ">
        <div className="flex flex-col lg:justify-center relative items-center bg-[#ebebeb] dark:bg-[#3f3f3f] rounded-lg max-h-[80vh] h-[80vh] w-[80vw] lg:w-[70vw]  overflow-y-auto  ">
          {isLoading && (
            <div className="absolute top-0 left-0 bg-[#ebebeb] dark:bg-[#3f3f3f] w-full h-full z-20">
              <div className="flex justify-center items-center py-8 ">
                <LoadingAnimationSmall />
              </div>
            </div>
          )}

          <div
            className="text-black dark:text-white w-full"
            onClick={() => props.setShowDiv(false)}
          >
            <AiOutlineClose
              size={30}
              className="absolute right-8 top-10 cursor-pointer hover:scale-125 z-20"
            />
          </div>
          {props.project && isReady && (
            <>
              <div className="flex flex-col lg:flex-row justify-center items-center pc:space-x-[10rem]">
                <div className="flex justify-center items-center lg:w-[20rem] lg:h-[15rem] xl:w-[25rem] xl:h-[20rem]  mt-6">
                  <div className="relative transform lg:scale-[120%] xl:scale-[150%] pc:scale-[200%]">
                    <CloudinaryContext cloudName="dlrhphkcb">
                      <img className="h-[10rem]  rounded-xl" src={photos[0]} />

                      <img
                        src={imageUrlLeft}
                        className="h-[4.7rem] absolute top-[2.8rem] left-[6rem] opacity-80"
                      />
                      <img
                        src={side_left}
                        className="h-[10rem] rounded-xl absolute top-0 left-0  "
                      />

                      {!imageUrlLeft && (
                        <>
                          <TransformedImage
                            publicId="elements/quarter_1_ycvbpt.png"
                            rgb={
                              props.project.selectedColors
                                .selectedColorQuarter_1.rgb
                            }
                            opacity="opacity-70"
                          />
                          <TransformedImage
                            publicId="elements/hill_1_h370h8.png"
                            rgb={
                              props.project.selectedColors.selectedColorHill_1
                                .rgb
                            }
                            opacity="opacity-70"
                          />
                        </>
                      )}

                      <TransformedImage
                        publicId="elements/tip_1_jxccem.png"
                        rgb={
                          props.project.selectedColors.selectedColorTip_1.rgb
                        }
                        opacity="opacity-70"
                      />
                      {props.project.swooshVisibility.isLeftSwooshVisible && (
                        <TransformedImage
                          publicId="elements/swosh_1_pxffyd.png"
                          rgb={
                            props.project.selectedColors.selectedColorSwosh_1
                              .rgb
                          }
                          opacity={imageUrlLeft ? "opacity-100" : "opacity-70"}
                        />
                      )}
                      <TransformedImage
                        publicId="elements/heel_logo_1_nowlsy.png"
                        rgb={
                          props.project.selectedColors.selectedColorHeel_logo_1
                            .rgb
                        }
                        opacity="opacity-70"
                      />
                      <TransformedImage
                        publicId="elements/toe_1_uz2weu.png"
                        rgb={
                          props.project.selectedColors.selectedColorToe_1.rgb
                        }
                        opacity="opacity-70"
                      />
                      <TransformedImage
                        publicId="elements/Eyestay_1_z5b6jc.png"
                        rgb={
                          props.project.selectedColors.selectedColorEyestay_1
                            .rgb
                        }
                        opacity="opacity-70"
                      />
                      {props.project.sideText.leftText && (
                        <div className="absolute w-[10rem] bottom-[3.35rem] left-[0.5rem]  text-center opacity-80">
                          <p
                            className="text-[0.43rem]"
                            style={{
                              color: `rgb(${props.project.selectedColorsText.selectedColorLeftText.rgb.r}, ${props.project.selectedColorsText.selectedColorLeftText.rgb.g}, ${props.project.selectedColorsText.selectedColorLeftText.rgb.b})`,
                            }}
                          >
                            {props.project.sideText.leftText}
                          </p>
                        </div>
                      )}
                      {renderPatch(
                        props.project.selectedPatches.selectedLeftPatch,
                        "absolute bottom-[4rem] right-[1.8rem] max-w-[1.4rem] max-h-[1.1rem]  opacity-90",
                        patches
                      )}
                    </CloudinaryContext>
                  </div>
                </div>
                <div className="flex justify-center items-center lg:w-[20rem] lg:h-[15rem] xl:w-[25rem] xl:h-[20rem]  mt-6">
                  <div className="relative transform lg:scale-[120%] xl:scale-[150%]  pc:scale-[200%]">
                    <CloudinaryContext cloudName="dlrhphkcb">
                      <img className="h-[10rem]  rounded-xl" src={photos[1]} />
                      <img
                        src={imageUrlRight}
                        className="h-[4.7rem] absolute top-[2.8rem] left-[1rem]  opacity-80"
                      />
                      <img
                        src={side_right}
                        className="h-[10rem]  rounded-xl absolute top-0 left-0 "
                      />

                      <TransformedImage
                        publicId="elements/toe_2_enco6w.png"
                        rgb={
                          props.project.selectedColors.selectedColorToe_1.rgb
                        }
                        opacity="opacity-70"
                      />
                      <TransformedImage
                        publicId="elements/tip_2_bmjg7i.png"
                        rgb={
                          props.project.selectedColors.selectedColorTip_1.rgb
                        }
                        opacity="opacity-70"
                      />
                      {!imageUrlRight && (
                        <>
                          <TransformedImage
                            publicId="elements/quarter_2_kjcplp.png"
                            rgb={
                              props.project.selectedColors
                                .selectedColorQuarter_2.rgb
                            }
                            opacity="opacity-70"
                          />
                          <TransformedImage
                            publicId="elements/heel_2_xtnwp2.png"
                            rgb={
                              props.project.selectedColors.selectedColorHeel_2
                                .rgb
                            }
                            opacity="opacity-70"
                          />
                        </>
                      )}
                      {props.project.swooshVisibility.isRightSwooshVisible && (
                        <TransformedImage
                          publicId="elements/swosh_2_twgxvt.png"
                          rgb={
                            props.project.selectedColors.selectedColorSwosh_2
                              .rgb
                          }
                          opacity={imageUrlRight ? "opacity-100" : "opacity-70"}
                        />
                      )}
                      <TransformedImage
                        publicId="elements/heel_logo_2_j4oj49.png"
                        rgb={
                          props.project.selectedColors.selectedColorHeel_logo_1
                            .rgb
                        }
                        opacity="opacity-70"
                      />
                      <TransformedImage
                        publicId="elements/eyestay_2_ciar70.png"
                        rgb={
                          props.project.selectedColors.selectedColorEyestay_2
                            .rgb
                        }
                        opacity="opacity-70"
                      />
                      {props.project.sideText.rightText && (
                        <div className="absolute w-[10rem] bottom-[3.45rem] right-[0.4rem]  text-center opacity-80">
                          <p
                            className="text-[0.43rem]"
                            style={{
                              color: `rgb(${props.project.selectedColorsText.selectedColorRightText.rgb.r}, ${props.project.selectedColorsText.selectedColorRightText.rgb.g}, ${props.project.selectedColorsText.selectedColorRightText.rgb.b})`,
                            }}
                          >
                            {props.project.sideText.rightText}
                          </p>
                        </div>
                      )}
                      {renderPatch(
                        props.project.selectedPatches.selectedRightPatch,
                        "absolute bottom-[4.2rem] left-[1.8rem] max-w-[1.4rem] max-h-[1.1rem]  opacity-90",
                        patches
                      )}
                    </CloudinaryContext>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row mt-4 lg:mt-4 xl:mt-2 2xl:mt-8 justify-center items-center text-xl xl:text-2xl">
                <p className=" text-black/80 dark:text-white/80 ">
                  {t("myProjects.text3")}:
                </p>
                <p className=" text-[#0078aa] pt-2 md:pt-0 md:ml-2">
                  {props.project.designName}
                </p>
              </div>

              <div className="flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-x-10 lg:space-y-0 mt-8 xl:mt-12 pb-10">
                <button
                  onClick={handleEdit}
                  className={`${buttonStyle} w-[10rem]`}
                >
                  <p className="text-lg ">{t("myProjects.text5")}</p>
                </button>
                <button
                  onClick={() => setShowDiv(!showDiv)}
                  className={`${buttonStyle} w-[10rem]`}
                >
                  <p className="text-lg ">{t("myProjects.text6")}</p>
                </button>
                <button
                  onClick={() => setShowSelectSize(!showSelectSize)}
                  className={`${buttonStyle} w-[14rem]`}
                >
                  <p className="text-lg ">{t("customization.text7")}</p>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default TwoSideViewDesignSection;
