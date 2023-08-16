import React, { useState, useEffect, useContext, useRef } from "react";
import Navbar from "../sections/Navbar";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { BiFilterAlt } from "react-icons/bi";
import ProductTemplate from "../elements/ProductTemplate";
import FilterSection from "../sections/FilterSection";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { ref, getDownloadURL } from "firebase/storage";
import storage from "../../firebase";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Pagination from "../elements/Pagination";
import LoadingAnimationSmall from "../elements/LoadingAnimatonSmall";
import InfoDivBottom from "../elements/InfoDivBottom";
import { FilterContext } from "../elements/FilterProvider";
import { useTranslation } from "react-i18next";
import validator from "validator";
import { UserContext } from "../elements/UserProvider";
import { ThemeContext } from '../elements/ThemeContext';

interface Shoe {
  _id: string;
  name: string;
  category: string;
  price: number;
  discountPrice: number;
  image: string;
  imageUrl?: string; // Dodane pole imageUrl
  isHearted: boolean; // Dodane pole isHearted
}

function Shop() {
  const { user, isUserLoggedIn } = useContext(UserContext);
  const { theme, setTheme } = useContext(ThemeContext);

  const navigate = useNavigate();
  const currentCode = localStorage.getItem("i18nextLng");
  const { t } = useTranslation();
  const {
    selectedBrand,
    setSelectedBrand,
    selectedCategory,
    setSelectedCategory,
    selectedPrice,
    setSelectedPrice,
    selectedMin,
    setSelectedMin,
    selectedMax,
    setSelectedMax,
    selectedSizes,
    setSelectedSizes,
    selectedSort,
    setSelectedSort,
    searchTerm,
    setSearchTerm
  } = useContext(FilterContext);


  const sizesNumber = Array.from({ length: 11 }, (_, index) => 36 + index);
  const [showFilter, setShowFilter] = useState(false);
  const categories = ["high", "low", "sport"];
  const brands = ["All", "Nike", "Adidas", "New Balance"];
  const priceRanges = ["range1", "range2", "range3", "range4"];
  const sortType = ["default", "newest", "priceLow", "priceHigh"];

  const { pageNumber } = useParams();

  const currentPage = parseInt(pageNumber ?? "1");

  const getInitialPage = () => {
    const shopFilters = localStorage.getItem("shopFilters");
    if (shopFilters) {
      const parsedFilters = JSON.parse(shopFilters);
      return parsedFilters.page || currentPage || 1;
    }
    return currentPage || 1;
  };

  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(getInitialPage());
  const [pages, setPages] = useState(1);
  const [currentMin, setCurrentMin] = useState("");
  const [currentMax, setCurrentMax] = useState("");
  const [showSort, setShowSort] = useState(false);
  const [favoriteShoesFetched, setFavoriteShoesFetched] = useState(false);

  const handleBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedBrand = event.target.value;
    setSelectedBrand(selectedBrand);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedSort = event.target.value;
    setSelectedSort(selectedSort);
    setShowSort(false);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedCategory = event.target.value;
    setSelectedCategory(selectedCategory);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedPrice = event.target.value;
    setSelectedPrice(selectedPrice);
  };

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMax(event.target.value);
  };
  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMin(event.target.value);
  };

  const handleSizesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    size: string
  ) => {
    if (event.target.checked) {
      setSelectedSizes((prevSizes) => [...prevSizes, size]);
    } else {
      setSelectedSizes((prevSizes) =>
        prevSizes.filter((size_) => size_ !== size)
      );
    }
  };


  const handleMinBlur = () => {
    if (
      currentMin &&
      validator.isNumeric(currentMin) &&
      parseInt(currentMin) > 0
    ) {
      if (currentCode === "pl") {
        const selectedPrice = parseInt(currentMin);
        const exchangeRatePLNToUSD = 1 / 4.08;
        const priceUSD = selectedPrice * exchangeRatePLNToUSD;
        const roundedPriceUSD = Math.ceil(priceUSD);
        setSelectedMin(roundedPriceUSD.toString());
      } else {
        setSelectedMin(currentMin);
      }
    }
  };

  const handleMaxBlur = () => {
    if (
      currentMax &&
      validator.isNumeric(currentMax) &&
      parseInt(currentMax) > 0
    ) {
      if (currentCode === "pl") {
        const selectedPrice = parseInt(currentMax);
        const exchangeRatePLNToUSD = 1 / 4.08;
        const priceUSD = selectedPrice * exchangeRatePLNToUSD;
        const roundedPriceUSD = Math.ceil(priceUSD);
        setSelectedMax(roundedPriceUSD.toString());
      } else {
        setSelectedMax(currentMax);
      }
    }
  };

  const handleClickFilter = () => {
    setShowFilter(!showFilter);
  };

  useEffect(() => {

    const filters = {
      selectedBrand,
      selectedCategory,
      selectedPrice,
      selectedMin,
      selectedMax,
      selectedSizes,
      selectedSort,
      page,
    };
    localStorage.setItem("shopFilters", JSON.stringify(filters));
  }, [selectedBrand, selectedCategory, selectedPrice, selectedMin, selectedMax, selectedSizes, selectedSort, page]);


  useEffect(() => {


    setFavoriteShoesFetched(false);
    setMessage("");
    setError("");
    window.scrollTo(0, 0);
    setLoading(true);

    const fetchShoes = async () => {
      try {
        const response = await axios.get(
          `/shoes?page=${page}&brand=${selectedBrand}&category=${selectedCategory}&price=${selectedPrice}&min=${selectedMin}&max=${selectedMax}&sizes=${selectedSizes.join(
            ","
          )}&sort=${selectedSort}&name=${searchTerm}`
        );

        const { data, pages: totalPages } = response.data;
        const fetchedShoes: any[] = data || [];
        const shoeImages = await Promise.all(
          fetchedShoes.map(async (shoe) => {
            const pathReference = ref(storage, `/mainPhoto/${shoe.image}.png`);
            const url = await getDownloadURL(pathReference);
            return {
              ...shoe,
              imageUrl: url,
            };
          })
        );

        if (response.data.message) {
          setMessage(response.data.message);
        }

        setPage(response.data.page)
        setPages(totalPages);
        setShoes(shoeImages);
        setLoading(false);
        setFavoriteShoesFetched(true);

        if (user?._id) {
          axios
            .get(`/getFavoriteShoesById/?userId=${user?._id}`)
            .then((response) => {

              if (response.data.favoriteShoes.length !== 0) {
                const favoriteShoesIds = response.data.favoriteShoes;
                const updatedShoes = shoeImages.map((shoe) => {
                  if (favoriteShoesIds.includes(shoe._id.toString())) {
                    return { ...shoe, isHearted: true };
                  }
                  return shoe;
                });
                setShoes(updatedShoes);
              }

            })
            .catch((error) => {
              console.error("Błąd podczas pobierania ulubionych butów", error);
            });
        }
      } catch (error) {
        console.log(error);
        const errorMessage = t("shop.error");
        setError(errorMessage);
      }
    };

    fetchShoes();


  }, [
    page,
    selectedBrand,
    selectedCategory,
    selectedPrice,
    selectedMin,
    selectedMax,
    selectedSizes,
    selectedSort,
    searchTerm,
    user,
  ]);

  const handleHeartClick = (shoe: Shoe) => {
    if (!isUserLoggedIn) {
      navigate("/login");
      return;
    }

    if (!shoe.isHearted) {
      axios
        .post("/saveFavoriteShoe", { userId: user?._id, shoeId: shoe._id })
        .then((response) => {
          console.log("Ulubiony but został zapisany w bazie danych");
        })
        .catch((error) => {
          console.error(
            "Błąd podczas zapisywania ulubionego buta w bazie danych",
            error
          );
        });
    } else {
      axios
        .delete(`/removeFavoriteShoe/${user?._id}/${shoe._id}`)
        .then((response) => {
          console.log("Ulubiony but został usunięty z bazy danych");
        })
        .catch((error) => {
          console.error(
            "Błąd podczas usuwania ulubionego buta z bazy danych",
            error
          );
        });
    }

    setShoes((prevShoes) => {
      const updatedShoes = prevShoes.map((prevShoe) => {
        if (prevShoe._id === shoe._id) {
          return {
            ...prevShoe,
            isHearted: !prevShoe.isHearted,
          };
        }
        return prevShoe;
      });
      return updatedShoes;
    });
  };

  const handleReset = () => {
    setSelectedCategory("");
    setSelectedPrice("");
    setSelectedMin("");
    setCurrentMin("");
    setSelectedMax("");
    setCurrentMax("");
    setSelectedSizes([]);
  }

  const formatSearchTerm = (term: string) => {
    if (!term) return ''; // Return an empty string if searchTerm is empty

    return term.charAt(0).toUpperCase() + term.slice(1);
  };

  const handleClickRemoveSearchTerm = () => {
    localStorage.removeItem("searchTerm");
    setSearchTerm("");
  };


  return (
    <>
      {error && (
        <div className="flex justify-center">
          <InfoDivBottom color={"bg-red-500"} text="Wystąpił błąd" />
        </div>
      )}

      {showFilter && (
        <FilterSection showFilter={showFilter} setShowFilter={setShowFilter} />
      )}

      <Navbar
        background="bg-white"
        extra="z-10 border-b-[2px] border-black/10 dark:border-white"
        shadow="none"
      />
      <div className="flex justify-center   xl:px-12 2xl:px-20 bg-white dark:bg-[#292929] min-h-screen ">
        <div className="hidden lg:flex flex-col items-center w-[270px] min-w-[270px] h-auto  border-r-[2px] dark:border-white border-black/10">
          <div className="text-left ">

            {searchTerm && (
              <div className="flex items-center mt-10 space-x-4">
                <p className="text-2xl text-black dark:text-white">
                  {formatSearchTerm(searchTerm)}
                </p>
                <div onClick={handleClickRemoveSearchTerm} className="cursor-pointer">
                  <AiOutlineClose size={30} color={theme === "dark" ? "white" : "black"} />
                </div>
              </div>)}

            <p className="mt-10 text-xl mb-4 text-black dark:text-white">
              {t("shop.category")}
            </p>

            <div className="flex flex-col space-y-3">
              {categories.map((category, index) => (
                <label key={index} className="cursor-pointer flex">
                  <input
                    type="radio"
                    className="peer sr-only"
                    name="category1"
                    value={category}
                    onChange={handleCategoryChange}
                    checked={category === selectedCategory}
                  />
                  <div className="w-5 h-5 border-2 border-black/20 dark:border-white rounded-full transition-all peer-checked:bg-black/80 dark:peer-checked:bg-white"></div>
                  <p className="px-4 text-black/60 dark:text-white">
                    {t(`categoryShoes.${category}`)}
                  </p>
                </label>
              ))}
            </div>

            <div className="mt-6 w-[10rem] h-[0.2rem] bg-black/10 dark:bg-white"></div>

            <p className="mt-6 text-xl mb-4 text-black dark:text-white">
              {t("shop.price")}
            </p>

            <div className="flex flex-col space-y-3">
              {priceRanges.map((range, index) => (
                <label key={index} className="cursor-pointer flex">
                  <input
                    type="radio"
                    className="peer sr-only"
                    name="price1"
                    value={range}
                    onChange={handlePriceChange}
                    checked={range === selectedPrice}
                  />
                  <div className="w-5 h-5 border-2 border-black/20 dark:border-white rounded-full transition-all peer-checked:bg-black/80 dark:peer-checked:bg-white"></div>
                  <p className="px-4 text-black/60 dark:text-white">
                    {t(`priceRange.${range}`)}
                  </p>
                </label>
              ))}
            </div>

            <div className="flex mt-4">
              <div className="flex flex-col items-center">
                <input
                  className="w-[3.5rem] h-[2rem] border-2 border-black/20 rounded-md focus:outline-none text-center"
                  placeholder="0"
                  onChange={handleMinChange}
                  onBlur={handleMinBlur}
                  value={currentMin}
                />
                <p className="text-black/60 dark:text-white">min</p>
              </div>

              <div className="w-[1.5rem] h-[0.2rem] bg-black/20 mx-2 mt-4 dark:bg-white"></div>

              <div className="flex flex-col items-center">
                <input
                  className="w-[3.5rem] h-[2rem] border-2 border-black/20 rounded-md focus:outline-none text-center"
                  placeholder="0"
                  onChange={handleMaxChange}
                  onBlur={handleMaxBlur}
                  value={currentMax}
                />
                <p className="text-black/60 dark:text-white">max</p>
              </div>
            </div>

            <div className="mt-6 w-[10rem] h-[0.2rem] bg-black/10 dark:bg-white"></div>

            <p className="mt-6 text-xl mb-4 text-black dark:text-white">
              {t("shop.size")}
            </p>

            <div className="grid grid-cols-4 mt-2 gap-y-2 gap-x-2 ">
              {sizesNumber.map((size) => (
                <label key={size} className="inline-block cursor-pointer">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    name="size-choice"
                    onChange={(event) =>
                      handleSizesChange(event, size.toString())
                    }
                    checked={selectedSizes.includes(size.toString())}
                  />
                  <div className="flex justify-center items-center w-[2.5rem] h-[2.5rem] border-2 border-black/20 rounded-lg bg-white shadow-md transition-all active:scale-95 peer-checked:bg-[#97DEFF] peer-checked:border-none">
                    <p className="text-black/80">{t(`sizes.${size}`)}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="px-2 py-1 border-2 border-black/60 text-black dark:text-white dark:border-white rounded-lg mt-6 hover:scale-105 transform ease-in-out duration-500 "
              >
                <p>{t("shop.reset")}</p>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full w-[100rem] pb-20">
          <p className=" text-black/80 dark:text-white text-3xl px-12 py-10 text-center lg:text-left ">
            {selectedBrand === "All" ? t("shop.all") : selectedBrand}
          </p>
          <div className="flex justify-between ">
            <div className="hidden lg:flex px-12 space-x-4">
              {brands.map((brand) => (
                <label key={brand} className="cursor-pointer ">
                  <input
                    type="radio"
                    className="peer sr-only"
                    name="brand1"
                    value={brand}
                    onChange={handleBrandChange}
                    checked={brand === selectedBrand}
                  />
                  <div className="flex  items-center px-2 h-[3rem] w-auto border-[2px] border-black/10 dark:border-white text-black/60 dark:text-white  rounded-md peer-checked:bg-[#97DEFF] peer-checked:text-black/60  peer-checked:border-none hover:scale-105 transform ease-in-out duration-500">
                    <p>{brand === "All" ? t("shop.all") : brand}</p>
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={handleClickFilter}
              className="flex lg:hidden ml-12 space-x-1  items-center justify-center px-2 h-[3rem] border-[2px] border-black/10 dark:border-white dark:text-white  text-black/60 rounded-md "
            >
              <p>Filtr</p>
              <BiFilterAlt size={15} />
            </button>

            <div className="relative flex xl:mr-20 mr-12 2xl:mr-12 h-[3rem] border-[2px] border-black/10 dark:border-white dark:text-white text-black/60 rounded-md">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center space-x-1 px-2"
              >
                <p>
                  {!selectedSort ? t(`shop.sort`) : t(`sort.${selectedSort}`)}
                </p>
                {showSort ? (
                  <AiOutlineUp size={15} />
                ) : (
                  <AiOutlineDown size={15} />
                )}
              </button>
              {showSort && (
                <div className="animate-sort-in absolute top-12 right-0 w-[10rem]   bg-white shadow-button mt-1 rounded z-10">
                  {sortType.map((sort) => (
                    <label key={sort} className="cursor-pointer ">
                      <input
                        type="radio"
                        className="peer sr-only"
                        name="sort"
                        value={sort}
                        onChange={handleSortChange}
                        checked={sort === selectedSort}
                      />
                      <p className="text-black/80 px-3 py-2 peer-checked:font-bold hover:bg-black/10 ">
                        {t(`sort.${sort}`)}
                      </p>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-[50vh]">
              <LoadingAnimationSmall />
            </div>
          ) : message ? (
            <div className="flex justify-center items-center h-[50vh]">
              <p className="text-lg text-black/80 dark:text-white/80 md:text-3xl">
                {t("shop.notFound")}
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap w-[96%] justify-center  mx-auto gap-10  mt-10 gap-y-10 xl:gap-x-14">
                {shoes.map((shoe) => (
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

              <Pagination page={page} pages={pages} changePage={setPage} />
            </>
          )}
        </div>
      </div >
    </>
  );
}

export default Shop;
