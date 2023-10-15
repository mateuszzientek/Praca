import React, { useState, useEffect, useContext } from "react";
import Navbar from "../sections/Navbar";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import storage from "../../firebase";
import color from "../../assets/images/color.png";
import { AiOutlinePlus } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import DesignSection from "../sections/DesignSection";
import PersonalizedShoesView from "../sections/PersonalizedShoesView";


function Customization() {

  const currentCode = localStorage.getItem("i18nextLng");
  const { t } = useTranslation();

  const [isDataFetched, setIsDataFetched] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizes, setShowSizes] = useState(false);
  const [showDesign, setShowDesign] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [patches, setPatches] = useState<Array<{ url: string; name: string; }>>([]);
  const sizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

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


        <div className="flex justify-center mt-10">
          <div className="flex w-[1600px] ">
            <div className="flex flex-col justify-center items-center w-[70%]">

              <div className="relative  ">
                <PersonalizedShoesView />
              </div>

            </div>
            <div className="w-[30%] h-[40rem] ">
              <p className="text-3xl text-black/80 dark:text-white/90 mt-20">
                Custom Nike Air Force 1 Low
              </p>
              <p className="text-xl text-black/80 dark:text-white/90 mt-4"> 115,00$</p>
              <p className="text-lg text-black/50 dark:text-white/60 mt-4"> Unisex Low Shoe</p>
              <p className="text-lg text-black/80 dark:text-white/90 mt-4">
                Stwórz swoje ulubione buty, zmieniając kolor odpowiednich elementów, dodajać napisy,
                naszywki oraz grafikę.
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

      </div>
    </>
  );
}

export default Customization;
