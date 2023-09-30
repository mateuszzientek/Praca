import React, { useState, useEffect } from "react";
import Navbar from "../sections/Navbar";
import { useParams } from "react-router-dom";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import storage from "../../firebase";
import LoadingAnimationSmall from "../elements/LoadingAnimatonSmall";
import color from "../../assets/images/color.png";
import { AiOutlinePlus } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import DesignSection from "../sections/DesignSection";

function Customization() {

  const currentCode = localStorage.getItem("i18nextLng");
  const { t } = useTranslation();

  const [isDataFetched, setIsDataFetched] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizes, setShowSizes] = useState(false);
  const [showDesign, setShowDesign] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const sizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];
  const { type } = useParams();

  useEffect(() => {
    if (showDesign) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up the effect
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showDesign]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const folderRef = ref(storage, `shoeType/${type}`);
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
        setIsDataFetched(true);
      } catch (error) {
        console.log(error);
        setIsDataFetched(true);
      }
    };

    fetchData();
  }, []);

  const handleChangeSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSize(event.target.value)
    setShowSizes(!showSizes)
  }

  const writeText = () => {

    let text1 = ""
    let text2 = ""
    let text3 = ""

    if (type === "low") {
      text1 = "Custom Nike Air Force 1 Low"
      text2 = "115,00$"
      text3 = "Unisex Low Shoe"
    } else {
      text1 = "Custom Nike Dunk High"
      text2 = "200,00$"
      text3 = "Unisex High Shoe"
    }

    return <>
      <p className="text-3xl text-black/80 mt-20">
        {text1}
      </p>
      <p className="text-xl text-black/80 mt-4"> {text2}</p>
      <p className="text-lg text-black/50 mt-4"> {text3}</p>
    </>
  }

  return (
    <>

      {showDesign && (
        <div className="fixed bg-white w-screen h-screen z-10 overflow-auto animate-opacity-fast">
          <DesignSection
            onDesignFinish={() => setShowDesign(false)}
            photos={photos}
          />

        </div>
      )}

      <div className="min-h-screen bg-[#F5EFE7] dark:bg-[#5c5c5c] pb-20">
        <Navbar background="bg-white" shadow="shadow-lg" />

        {!isDataFetched ? (
          <div className="flex justify-center mt-[10rem]">
            <LoadingAnimationSmall />
          </div>
        ) : (
          <div className="flex justify-center mt-10">
            <div className="flex w-[1600px] ">
              <div className="relative flex flex-col items-center w-[70%] ">
                <div className="grid grid-cols-2 grid-rows-2 mt-10 ">
                  {photos.map((photo, index) => (
                    <div
                      key={index}

                    >
                      <img className="h-[20rem] object-fill" src={photo} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-[30%] h-[40rem] ">
                {writeText()}
                <p className="text-lg text-black/80 mt-4">
                  Stwórz swoje ulubione buty, zmieniając kolor, dodajać napisy,
                  naszywki oraz grafiki dla odpowiednich elementów buta.
                </p>

                <button onClick={() => setShowDesign(!showDesign)} className="flex justify-center items-center space-x-2 w-full h-[3rem] text-black/80 border-2 border-black/30 mt-10  hover:bg-black/80 hover:text-white/80 ease-in-out duration-300">
                  <img className="h-[1.5rem]" src={color} />
                  <p className="text-xl  font-semibold">Personalizuj</p>
                </button>
                <div className="relative w-full">
                  <div onClick={() => setShowSizes(!showSizes)} className="flex justify-between items-center px-6 w-full py-3 text-black/80 border-2 border-black/30 mt-10 cursor-pointer">
                    {selectedSize !== "" ? (

                      <p className="text-xl ">Size: {t(`sizes.${selectedSize}`)}</p>
                    ) : (
                      <>
                        <p className="text-xl ">Select Size</p>
                        <AiOutlinePlus size={20} />
                      </>)}

                  </div>
                  {showSizes && (<div className={`absolute bottom-16 w-full bg-white animate-fade-in `}>

                    <div className="flex flex-col ">
                      {sizes.map((size) => (
                        <label
                          key={size}

                        >
                          <input
                            type="radio"
                            className="peer sr-only"
                            name="sizeChoice"
                            value={size}
                            onChange={handleChangeSize}

                          />
                          <div
                            className={`flex space-x-2 py-1 items-center text-xl text-black/80 dark:text-white pl-4 border-t-2 border-black/10 hover:bg-black/10`}
                          >
                            <p>{currentCode !== "pl" ? "US" : "EU"}</p>
                            <p>{t(`sizes.${size}`)}</p>
                          </div>

                        </label>
                      ))}
                    </div>

                  </div>)}
                </div>

                <button className="px-6 w-full py-3 text-white/80 bg-black/80 mt-10  hover:scale-105 ease-in-out duration-500">
                  <p className="text-xl ">Dodaj do koszyka</p>
                </button>
                <p className="text-lg text-black/80 mt-4">
                  Estimated delivery 3-4 weeks{" "}
                </p>

              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Customization;
