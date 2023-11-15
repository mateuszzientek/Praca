import React, { useState, useEffect, useContext } from "react";
import Navbar from "../sections/Navbar";
import {
  ref,
  getDownloadURL,
  listAll,
  deleteObject,
  uploadBytes,
} from "firebase/storage";
import storage from "../../resources/firebase";
import color from "../../assets/images/color.png";
import { AiOutlinePlus, AiOutlineFilePdf } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import DesignSection from "../sections/DesignSection";
import PersonalizedShoesView from "../sections/PersonalizedShoesView";
import { formatPrice } from "src/resources/currencyUtils";
import axios from "axios";
import { UserContext } from "../elements/UserProvider";
import { CustomContext } from "../elements/CustomProvider";
import InfoDivBottom from "../elements/InfoDivBottom";
import CircleSvg from "../elements/CircleSvg";
import LoadingAnimationSmall from "../elements/LoadingAnimatonSmall";
import { useNavigate, useParams } from "react-router-dom";
import CustomShoesOrder from "../sections/CustomShoesOrder";
import { ProjectItem } from "src/types";
import { ThemeContext } from "../elements/ThemeContext";


function Customization() {

  const { theme } = useContext(ThemeContext);
  const { projectName } = useParams();
  const navigate = useNavigate();
  const {
    setSelectedColors,
    setSwooshVisibility,
    setSelectedColorsText,
    setSideText,
    setSelectedPatches,
    setImagesUrls,
    imagesUrls,
    selectedColors,
    selectedColorsText,
    selectedPatches,
    swooshVisibility,
    patches,
    photos,
    sideText,
    setLeftSideImageCropped,
    setRightSideImageCropped,
  } = useContext(CustomContext);
  const { user } = useContext(UserContext);

  //////////Variables////////////

  const [loading, setLoading] = useState(false);
  const [showDesignPanel, setShowDesignPanel] = useState(false);
  const currentCode = localStorage.getItem("i18nextLng");
  const { t } = useTranslation();
  const [selectedSize, setSelectedSize] = useState("");
  const [designName, setDesignName] = useState("");
  const [projectNameError, setProjectNameError] = useState("");
  const [showSizes, setShowSizes] = useState(false);
  const sizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];
  const [isReady, setIsReady] = useState(false);
  const [showSaveProject, setShowSaveProject] = useState(false);
  const [showDivSaveProject, setShowDivSaveProject] = useState(false);
  const [message, setMessage] = useState("");
  const [errorsServer, setErrorsServer] = useState("");
  const [takenDesignName, setTakenDesignName] = useState("");
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [canOrder, setCanOrder] = useState(false);
  const [orderMessageProject, setOrderMessageProject] = useState("");
  const [orderMessageSize, setOrderMessageSize] = useState("");
  const [showCustomShoesOrder, setShowCustomShoesOrder] = useState(false);

  /////////Functions////////////

  const handleChangeDesignName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProjectNameError("");
    setTakenDesignName("");
    setDesignName(event.target.value);
  };

  const handleChangeSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSize(event.target.value);
    setShowSizes(!showSizes);
  };

  const saveProject = async () => {
    setProjectNameError("");

    if (!designName) {
      const text = t("customization.text11");
      setProjectNameError(text);
      return;
    }

    const userId = user ? user._id : "";

    const customContextData = {
      selectedColors,
      selectedColorsText,
      selectedPatches,
      swooshVisibility,
      sideText,
      designName,
    };

    try {
      const response = await axios.post("/saveDesignProject", {
        customContextData,
        userId,
      });

      if (response.data.taken) {
        const text = t("customization.text14");
        setTakenDesignName(text);
        return;
      }
      setLoading(true);

      const userStorageRef = ref(storage, `/customImages/${userId}`);
      const userImages = await listAll(userStorageRef);

      const newStorageRef = ref(
        storage,
        `/designProject/${userId}/${designName}`
      );

      for (const imageRef of userImages.items) {
        const fileName = imageRef.name;

        const imageUrl = await getDownloadURL(imageRef);
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const newImageRef = ref(newStorageRef, fileName);
        await uploadBytes(newImageRef, blob); // Zapisanie pliku w nowym folderze
      }

      for (const imageRef of userImages.items) {
        if (
          imageRef.name.startsWith(`left`) ||
          imageRef.name.startsWith(`right`)
        ) {
          await deleteObject(imageRef);
        }
      }

      const text = t("customization.text13");
      setMessage(text);
      setTimeout(() => {
        navigate("/myProjects");
      }, 700);
    } catch (error) {
      const text = t("customization.text12");
      setErrorsServer(text);
    }
  };

  const handleOrder = () => {
    setOrderMessageProject("");
    setOrderMessageSize("");

    if (!canOrder) {
      setOrderMessageProject("Stwórz projekt aby dokonać zakupu");
      return;
    }
    if (!selectedSize) {
      setOrderMessageSize("Wybierz rozmiar obuwia");
      return;
    }

    setShowCustomShoesOrder(true);
  };

  /////////UseEffects///////////

  useEffect(() => {
    if (showDesignPanel) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showDesignPanel]);

  useEffect(() => {
    if (projectName) {
      window.history.replaceState(null, "", "/customization");
      setShowDesignPanel(true);
    } else {
      const initialSelectedColors = {
        selectedColorSwosh_1: { rgb: { r: 255, g: 255, b: 255 } },
        selectedColorTip_1: { rgb: { r: 255, g: 255, b: 255 } },
        selectedColorHill_1: { rgb: { r: 255, g: 255, b: 255 } },
        selectedColorQuarter_1: { rgb: { r: 255, g: 255, b: 255 } },
        selectedColorHeel_logo_1: { rgb: { r: 255, g: 255, b: 255 } },
        selectedColorToe_1: { rgb: { r: 255, g: 255, b: 255 } },
        selectedColorEyestay_1: { rgb: { r: 255, g: 255, b: 255 } },
        selectedColorQuarter_2: { rgb: { r: 255, g: 255, b: 255 } },
        selectedColorSwosh_2: { rgb: { r: 255, g: 255, b: 255 } },
        selectedColorHeel_2: { rgb: { r: 255, g: 255, b: 255 } },
        selectedColorEyestay_2: { rgb: { r: 255, g: 255, b: 255 } },
      };

      const initialSelectedColorsText = {
        selectedColorLeftText: { rgb: { r: 0, g: 0, b: 0 } },
        selectedColorRightText: { rgb: { r: 0, g: 0, b: 0 } },
      };

      const initialSelectedPatches = {
        selectedLeftPatch: "",
        selectedRightPatch: "",
      };

      const initialSwooshVisibility = {
        isLeftSwooshVisible: true,
        isRightSwooshVisible: true,
      };

      const initialSideText = { leftText: "", rightText: "" };

      setImagesUrls({
        leftSideImageCroppedUrl: "",
        rightSideImageCroppedUrl: "",
      });
      setSelectedColors(initialSelectedColors);
      setSelectedColorsText(initialSelectedColorsText);
      setSelectedPatches(initialSelectedPatches);
      setSwooshVisibility(initialSwooshVisibility);
      setSideText(initialSideText);
      setLeftSideImageCropped(null);
      setRightSideImageCropped(null);

      const fetchData = async () => {
        try {
          const userId = user ? user._id : "";
          const response = await axios.get(
            `/getCustomShoeTemporary?userId=${userId}`
          );
          const userDocument = response.data.userDocument;

          console.log(userDocument)
          if (userDocument) {
            setShowSaveProject(true);
            setCanOrder(true);
            setProject(userDocument);

            setSelectedColors(userDocument.selectedColors);
            setSelectedColorsText(userDocument.selectedColorsText);
            setSelectedPatches(userDocument.selectedPatches);
            setSwooshVisibility(userDocument.swooshVisibility);
            setSideText(userDocument.sideText);

            const userStorageRef = ref(storage, `/customImages/${userId}`);

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
              console.log("Folder nie istnieje");
            }
          }
        } catch (error) {
          const text = t("customization.text12");
          setErrorsServer(text);
          console.error("Błąd podczas pobierania danych w customization");
        }
      };

      fetchData();
    }

    setIsReady(true);
  }, []);

  return (
    <>
      <div className="flex justify-center z-20">
        {errorsServer && (
          <InfoDivBottom color="bg-red-500" text={errorsServer} />
        )}

        {message && <InfoDivBottom color="bg-green-500" text={message} />}
      </div>

      {showCustomShoesOrder && (
        <CustomShoesOrder
          setShowMainDiv={setShowCustomShoesOrder}
          project={project}
          size={selectedSize}
        />
      )}

      {showDivSaveProject && (
        <div className="bg-black/50 backdrop-blur-sm fixed w-full h-screen z-[2] flex justify-center items-center overflow-y-auto">
          <div className="bg-white dark:bg-[#bfbfbf] rounded-lg w-[45rem] text-center py-8">
            <p className="text-3xl text-black">{t("customization.text9")}</p>
            <div className="flex flex-col items-start ml-10 mt-8">
              <p className="text-xl text-left text-black ">
                {t("customization.text10")}
              </p>
              <input
                value={designName}
                maxLength={20}
                onChange={handleChangeDesignName}
                className="w-[90%] text-lg px-4 h-[3rem] rounded-lg border-black/80 border-2 mt-4 flex outline-none"
              ></input>
              <p className="text-black/60 text-base mt-2 ">
                {t("customization.text15")}
              </p>

              {projectNameError && (
                <p className="text-red-500 text-base mt-2 ">
                  {projectNameError}
                </p>
              )}
              {takenDesignName && (
                <p className="text-red-500 text-base mt-2 ">
                  {takenDesignName}
                </p>
              )}
            </div>

            <div className="flex justify-center items-center  mt-8 space-x-6">
              <button
                onClick={() => {
                  setShowDivSaveProject(!showDivSaveProject);
                  setProjectNameError("");
                  setTakenDesignName("");
                  setDesignName("");
                }}
                className={`px-8 py-3 border-2 border-black/80 rounded-full hover:bg-black/80 hover:text-white`}
              >
                <p className="text-lg">{t("designSection.text1")}</p>
              </button>

              <button
                onClick={saveProject}
                disabled={loading}
                className={`px-8 py-3 border-2 border-black/80 rounded-full  ${!loading ? "hover:bg-black/80 hover:text-white" : ""
                  }`}
              >
                <div className="flex items-center justify-center">
                  {loading && <CircleSvg color={"black"} secColor={"black"} />}
                  <p className="text-lg">{t("designSection.text2")}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {showDesignPanel && (
        <>
          {!isReady ? (
            <div className="flex justify-center items-center fixed bg-white dark:bg-[#3b3b3b] w-full h-full z-[10]">
              <LoadingAnimationSmall />
            </div>
          ) : (
            <div className="fixed w-full h-full z-[10] overflow-y-auto">
              <DesignSection
                photos={photos}
                patches={patches}
                param={projectName}
              />
            </div>
          )}
        </>
      )}

      <div className="min-h-screen bg-[#F5EFE7] dark:bg-[#5c5c5c] xl:pb-20 pb-16">
        <Navbar background="bg-white" shadow="shadow-lg" />

        {!isReady ? (
          <div className="flex justify-center items-center h-[50vh]">
            <LoadingAnimationSmall />
          </div>
        ) : (
          <div
            className={`flex justify-center  ${showSaveProject ? "xl:mt-6" : "pc:mt-20 xl:mt4"
              }`}
          >
            <div className="flex flex-col justify-center items-center xl:flex-row  ">
              <div className="flex flex-col justify-center items-start xl:w-[45%] 2xl:w-[50%] min-[1900px]:w-[50%] xl:ml-10">
                <div className="flex justify-center items-center md:w-[30rem]  md:h-[25rem] mt-16 xl:mt-0">
                  <div className="relative transform md:scale-[130%] xl:scale-[150%] pc:scale-[170%]">
                    <PersonalizedShoesView
                      selectedColors={selectedColors}
                      selectedColorsText={selectedColorsText}
                      selectedPatches={selectedPatches}
                      swooshVisibility={swooshVisibility}
                      sideText={sideText}
                    />
                  </div>
                </div>
              </div>
              <div className=" w-[80%] xl:w-[35%] ">
                <p className="text-3xl text-black/80 dark:text-white/90 mt-16">
                  {t("customization.text1")}
                </p>
                <p className="text-xl text-black/80 dark:text-white/90 mt-4">
                  {" "}
                  {formatPrice(115, t)}
                </p>
                <p className="text-lg text-black/50 dark:text-white/60 mt-4">
                  {" "}
                  {t("customization.text2")}
                </p>
                <p className="text-lg text-black/80 dark:text-white/90 mt-4">
                  {t("customization.text3")}
                </p>

                <button
                  onClick={() => {
                    setShowDesignPanel(true);
                  }}
                  className="flex justify-center items-center space-x-2 w-full h-[3rem] text-black/80 dark:text-white/90 border-2 border-black/30 dark:border-white/50 mt-10  hover:bg-black/80 hover:dark:bg-white/50 hover:text-white/80 ease-in-out duration-300"
                >
                  <img className="h-[1.5rem]" src={color} />
                  <p className="text-xl  font-semibold">
                    {t("customization.text4")}
                  </p>
                </button>
                <div className="relative w-full">
                  <div
                    onClick={() => setShowSizes(!showSizes)}
                    className="flex justify-between items-center px-6 w-full py-3 text-black/80 dark:text-white/90 border-2 border-black/30 dark:border-white/50 mt-10 cursor-pointer"
                  >
                    {selectedSize !== "" ? (
                      <p className="text-xl  ">
                        {t("customization.text5")} {t(`sizes.${selectedSize}`)}
                      </p>
                    ) : (
                      <>
                        <p className="text-xl ">{t("customization.text6")}</p>
                        <AiOutlinePlus size={20} />
                      </>
                    )}
                  </div>
                  {showSizes && (
                    <div
                      className={`absolute bottom-16 w-full bg-white dark:bg-[#b5b5b5] animate-fade-in `}
                    >
                      <div className="flex flex-col ">
                        {sizes.map((size) => (
                          <label key={size}>
                            <input
                              type="radio"
                              className="peer sr-only"
                              name="sizeChoice"
                              value={size}
                              onChange={handleChangeSize}
                            />
                            <div
                              className={`flex space-x-2 py-1 items-center text-xl text-black/80   pl-4 border-t-2 border-black/10 hover:bg-black/10`}
                            >
                              <p>{currentCode !== "pl" ? "US" : "EU"}</p>
                              <p>{t(`sizes.${size}`)}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {showSaveProject && (
                  <button
                    onClick={() => setShowDivSaveProject(!showDivSaveProject)}
                    className="px-6 w-full py-3 text-black/80 dark:text-black/80 bg-[#7cd6ff]  mt-10  hover:scale-105 ease-in-out duration-500"
                  >
                    <p className="text-xl ">{t("customization.text9")}</p>
                  </button>
                )}

                <button
                  onClick={handleOrder}
                  className="px-6 w-full py-3 text-white/80 dark:text-black/80 bg-black/80 dark:bg-white/80 mt-10  hover:scale-105 ease-in-out duration-500"
                >
                  <p className="text-xl ">{t("customization.text7")}</p>
                </button>
                {orderMessageProject && (
                  <p className="text-red-500 text-base mt-2 ">
                    {orderMessageProject}
                  </p>
                )}
                {orderMessageSize && (
                  <p className="text-red-500 text-base mt-2 ">
                    {orderMessageSize}
                  </p>
                )}
                <p className="text-lg text-black/80 dark:text-white/90 mt-4">
                  {t("customization.text8")}{" "}
                </p>


                <div className="flex items-center mt-4">
                  <a
                    href={currentCode === "pl" ? "/assets/pdfs/instrukcja_pl.pdf" : "/assets/pdfs/instrukcja_en.pdf"}
                    download={currentCode === "pl" ? "instrukcja.pdf" : "instruction.pdf"}
                    className="flex items-center space-x-2"
                  >
                    <AiOutlineFilePdf size={20} color={theme === "dark" ? "white" : "black"} />
                    <p className="text-lg text-black/80 dark:text-white/90">{t("customization.text16")}</p>
                  </a>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Customization;
