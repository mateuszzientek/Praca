import React, { useState, useEffect } from "react";
import Navbar from "../sections/Navbar";
import { useParams } from "react-router-dom";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import storage from "../../firebase";
import LoadingAnimationSmall from "../elements/LoadingAnimatonSmall";
import color from "../../assets/images/color.png";
import { AiOutlinePlus } from "react-icons/ai";
import {
  MdArrowForwardIos,
  MdArrowBackIos
} from "react-icons/md";
import { useTranslation } from "react-i18next";
import DesignSection from "../sections/DesignSection";

function Customization() {

  const currentCode = localStorage.getItem("i18nextLng");
  const { t } = useTranslation();

  const [isDataFetched, setIsDataFetched] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizes, setShowSizes] = useState(false);
  const [showDesign, setShowDesign] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [patches, setPatches] = useState<Array<{ url: string; name: string; }>>([]);
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

        const folderPatchesRef = ref(storage, `patches`);
        const resPatches = await listAll(folderPatchesRef);
        const patchInfoArray = []; // Tablica na obiekty zawierające URL i nazwę zdjęcia

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

  const handleChangeSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSize(event.target.value)
    setShowSizes(!showSizes)
  }

  const handlePreviousPhoto = () => {
    setCurrentIndex((prevIndex: number) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const handleNextPhoto = () => {
    setCurrentIndex((prevIndex: number) => (prevIndex + 1) % photos.length);
  };


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
      <p className="text-3xl text-black/80 dark:text-white/90 mt-20">
        {text1}
      </p>
      <p className="text-xl text-black/80 dark:text-white/90 mt-4"> {text2}</p>
      <p className="text-lg text-black/50 dark:text-white/60 mt-4"> {text3}</p>
    </>
  }


  return (
    <>

      {showDesign && (
        <div className="fixed bg-white dark:bg-[#676767]  w-screen h-screen z-10 overflow-auto animate-opacity-fast">
          <DesignSection
            onDesignFinish={() => setShowDesign(false)}
            photos={photos}
            patches={patches}
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
              <div className="flex flex-col justify-center items-center w-[70%]  ">

                <div className="relative ">
                  <img className="h-[30rem] rounded-xl" src={photos[currentIndex]} />

                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-[20rem] mt-10 text-black ">
                    <MdArrowBackIos size={30} className="cursor-pointer" onClick={handlePreviousPhoto} />
                    <MdArrowForwardIos size={30} className="cursor-pointer" onClick={handleNextPhoto} />
                  </div>
                </div>

              </div>
              <div className="w-[30%] h-[40rem] ">
                {writeText()}
                <p className="text-lg text-black/80 dark:text-white/90 mt-4">
                  Stwórz swoje ulubione buty, zmieniając kolor, dodajać napisy,
                  naszywki oraz grafiki dla odpowiednich elementów buta.
                </p>

                <button onClick={() => setShowDesign(!showDesign)} className="flex justify-center items-center space-x-2 w-full h-[3rem] text-black/80 dark:text-white/90 border-2 border-black/30 dark:border-white/50 mt-10  hover:bg-black/80 hover:dark:bg-white/50 hover:text-white/80 ease-in-out duration-300">
                  <img className="h-[1.5rem]" src={color} />
                  <p className="text-xl  font-semibold">Personalizuj</p>
                </button>
                <div className="relative w-full">
                  <div onClick={() => setShowSizes(!showSizes)} className="flex justify-between items-center px-6 w-full py-3 text-black/80 dark:text-white/90 border-2 border-black/30 dark:border-white/50 mt-10 cursor-pointer">
                    {selectedSize !== "" ? (

                      <p className="text-xl  ">Size: {t(`sizes.${selectedSize}`)}</p>
                    ) : (
                      <>
                        <p className="text-xl ">Select Size</p>
                        <AiOutlinePlus size={20} />
                      </>)}

                  </div>
                  {showSizes && (<div className={`absolute bottom-16 w-full bg-white dark:bg-[#b5b5b5] animate-fade-in `}>

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
                            className={`flex space-x-2 py-1 items-center text-xl text-black/80   pl-4 border-t-2 border-black/10 hover:bg-black/10`}
                          >
                            <p>{currentCode !== "pl" ? "US" : "EU"}</p>
                            <p>{t(`sizes.${size}`)}</p>
                          </div>

                        </label>
                      ))}
                    </div>

                  </div>)}
                </div>

                <button className="px-6 w-full py-3 text-white/80 dark:text-black/80 bg-black/80 dark:bg-white/80 mt-10  hover:scale-105 ease-in-out duration-500">
                  <p className="text-xl ">Dodaj do koszyka</p>
                </button>
                <p className="text-lg text-black/80 dark:text-white/90 mt-4">
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
