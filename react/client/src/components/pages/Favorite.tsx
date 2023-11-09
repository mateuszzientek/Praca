import React, { useEffect, useState, useContext } from "react";
import Navbar from "../sections/Navbar";
import ProductTemplate from "../elements/ProductTemplate";
import axios from "axios";
import LoadingAnimationSmall from "../elements/LoadingAnimatonSmall";
import { UserContext } from "../elements/UserProvider";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import storage from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoeInterface } from "src/types";

interface Shoe extends ShoeInterface {
  isHearted: boolean;
}

function Favorite() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoadingImages, setIsLoadingImages] = useState(true); // Nowy stan
  const { user, isUserLoggedIn, isUserDataLoaded } = useContext(UserContext);
  const [favoriteShoes, setFavoriteShoes] = useState<Shoe[]>([]);

  useEffect(() => {
    const fetchFavoriteShoes = async () => {
      try {
        if (isUserDataLoaded && !user?._id) {
          navigate("/login");
        } else {
          const response = await axios.get(
            `/getFavoriteShoes/?userId=${user?._id}`
          );

          const fetchedShoes: any[] = response.data.favoriteShoes || [];
          const shoeImages = await Promise.all(
            fetchedShoes.map(async (shoe) => {
              const pathReference = ref(
                storage,
                `/mainPhoto/${shoe.image}.png`
              );
              const url = await getDownloadURL(pathReference);
              return {
                ...shoe,
                imageUrl: url,
                isHearted: true,
              };
            })
          );
          setFavoriteShoes(shoeImages);
          setIsLoadingImages(false); // Zakończono ładowanie zdjęć
        }
      } catch (error) {
        console.log("blad");
        setIsLoadingImages(false);
      }
    };

    fetchFavoriteShoes();
  }, [user]);

  const handleHeartClick = (shoe: Shoe) => {
    axios
      .delete(`/removeFavoriteShoe/${user?._id}/${shoe._id}`)
      .then((response) => {
        console.log("Ulubiony but został usunięty z bazy danych");
        const updatedShoes = favoriteShoes.filter(
          (prevShoe) => prevShoe._id !== shoe._id
        );
        setFavoriteShoes(updatedShoes);
      })
      .catch((error) => {
        console.error(
          "Błąd podczas usuwania ulubionego buta z bazy danych",
          error
        );
      });
  };

  return (
    <div className="bg-white dark:bg-black/80 min-h-screen pb-10">
      <Navbar background="bg-white" shadow="shadow-lg" />
      <div className="flex justify-center">
        <p className="text-4xl text-black/80 dark:text-white mt-16">
          {t("favoriteShoes.text1")}
        </p>
      </div>

      {isLoadingImages ? (
        <div className="flex justify-center items-center h-[60vh]">
          <LoadingAnimationSmall />
        </div>
      ) : favoriteShoes.length === 0 ? (
        <div className="flex justify-center items-center mt-20">
          <p className="text-base md:text-2xl text-black/70 dark:text-white/70">
            {t("favoriteShoes.text2")}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap w-[90%] justify-center  mx-auto gap-10  mt-10 gap-y-10 pb-10">
            {favoriteShoes.map((shoe) => (
              <div key={shoe._id}>
                <ProductTemplate
                  idShoe={shoe._id}
                  shoe={shoe}
                  isHearted={shoe.isHearted}
                  imageUrl={shoe.imageUrl || ""}
                  discountPrice={shoe.discountPrice}
                  price={shoe.price}
                  name={shoe.name}
                  handleHeartClick={handleHeartClick}
                  category={shoe.category}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Favorite;
