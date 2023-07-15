import React, { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import Navbar from '../sections/Navbar';
import maslo from "../../assets/images/maslo.png"
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BsTruck, BsShield } from 'react-icons/bs';
import { ThemeContext } from '../elements/ThemeContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LoadingAnimationSmall from '../elements/LoadingAnimatonSmall';
import { ref, getDownloadURL, listAll } from "firebase/storage";
import storage from '../../firebase';
import { UserContext } from '../elements/UserProvider';
import { useNavigate } from 'react-router-dom';

interface ShoeSize {
    size: string;
    quantity: number;
}

interface Shoe {
    _id: string;
    name: string;
    category: string;
    price: number;
    discountPrice: number;
    image: string;
    imageUrl?: string; // Dodane pole imageUrl
    isHearted: boolean;
    sizes: ShoeSize[];

}

function ShoeView() {

    const navigate = useNavigate();
    const currentCode = localStorage.getItem('i18nextLng')
    const { t } = useTranslation();
    const { id } = useParams();
    const { theme, setTheme } = useContext(ThemeContext);
    const { user, isUserLoggedIn, isUserDataLoaded } = useContext(UserContext);

    const [shoe, setShoe] = useState<Shoe>({} as Shoe);
    const [isLoading, setIsLoading] = useState(true);
    const [arePhotosLoaded, setArePhotosLoaded] = useState(false);
    const [photos, setPhotos] = useState<string[]>([]);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

    const convertPriceToPLN = (priceUSD: number) => {
        const exchangeRateUSDToPLN = 4.08;
        const pricePLN = priceUSD * exchangeRateUSDToPLN;
        const roundedPricePLN = Math.round(pricePLN / 5) * 5; // Zaokrąglenie do najbliższej liczby kończącej się na 5 lub 0
        return roundedPricePLN;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/getShoeById?id=${id}`);
                setShoe(response.data);
                setIsLoading(false);

                if (response.data) {
                    const folderRef = ref(storage, `shoeViewPhotos/${response.data.image}`);
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
                    setArePhotosLoaded(true); // Oznaczamy, że zdjęcia zostały załadowane

                    if (response.data._id && user?._id) {
                        const favoriteShoesResponse = await axios.get(`/getFavoriteShoesById?userId=${user._id}`);
                        const favoriteShoeIds = favoriteShoesResponse.data;

                        const isFavorite = favoriteShoeIds.includes(response.data._id);
                        setShoe((prevShoe) => ({ ...prevShoe, isHearted: isFavorite }));
                    }
                }
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);


    const handleHeartClick = () => {

        if (isUserDataLoaded && !isUserLoggedIn) {
            navigate('/login');
            return;
        }

        if (!shoe.isHearted) {
            axios.post("/saveFavoriteShoe", { userId: user?._id, shoeId: shoe._id })
                .then(response => {
                    console.log("Ulubiony but został zapisany w bazie danych");
                })
                .catch(error => {
                    console.error("Błąd podczas zapisywania ulubionego buta w bazie danych", error);
                });
        } else {
            axios.post("/removeFavoriteShoe", { userId: user?._id, shoeId: shoe._id })
                .then(response => {
                    console.log("Ulubiony but został usunięty z bazy danych");
                })
                .catch(error => {
                    console.error("Błąd podczas usuwania ulubionego buta z bazy danych", error);
                });
        }

        setShoe(prevShoe => ({
            ...prevShoe,
            isHearted: !prevShoe.isHearted
        }));
    };



    return (
        <div className='min-h-screen bg-[#f5f5f5]  dark:bg-black/80'>
            <Navbar background="bg-white" shadow="none" />
            <div className='flex justify-center'>

                {isLoading ? (
                    <div className='mt-[20rem]'>
                        <LoadingAnimationSmall />
                    </div>
                ) : !arePhotosLoaded ?
                    <div className='mt-[20rem]'>
                        <LoadingAnimationSmall />
                    </div>
                    :
                    (<div className='flex lg:flex-row flex-col justify-center lg:space-x-20 xl:space-x-40 mb-20'>
                        <div className='flex flex-col items-center mt-12 xl:mt-0 '>
                            <div >
                                <img
                                    src={photos[selectedPhotoIndex]}
                                    className='rounded-xl w-[400px] h-[400px] md:w-[450px] md:h-[450px] xl:w-[500px] xl:h-[500px]  2xl:w-[600px] 2xl:h-[600px]' />
                            </div>

                            <div className='flex space-x-3  '>
                                {photos.map((photo, index) => (
                                    <div
                                        key={index}
                                        className={`cursor-pointer w-[5rem] h-[5rem] md:w-[7rem] md:h-[7rem] lg:w-[5rem] lg:h-[5rem] xl:w-[7rem] xl:h-[7rem] bg-white dark:bg-black/50 shadow-lg ${selectedPhotoIndex === index ? 'border-2 border-[#97DEFF]' : ''
                                            }`}
                                        onClick={() => setSelectedPhotoIndex(index)}
                                    >
                                        <img className='w-full h-full' src={photo} />
                                    </div>
                                ))}
                            </div>

                        </div>

                        <div className='flex justify-center mt-24'>
                            <div className='flex flex-col items-center lg:items-start justify-start'>
                                <p className='text-xl xl:text-2xl text-black/60 dark:text-white/60 mb-3'>{t(`categoryShoes.${shoe.category}`)}</p>
                                <div className='flex items-center space-x-12'>
                                    <p className='text-3xl xl:text-4xl text-black/90 dark:text-white/90'>{shoe.name}</p>

                                </div>
                                <div className='flex items-center mt-4 space-x-2'>
                                    {shoe.discountPrice !== 0 && (<p className='line-through text-2xl text-black/50 dark:text-white/50'>{currentCode !== 'pl' ? t('currencySymbol') : ""}{currentCode === 'pl' ? convertPriceToPLN(shoe.discountPrice) : shoe.discountPrice + ",00"} {currentCode === 'pl' ? t('currencySymbol') : ""}</p>)}
                                    <p className='text-2xl xl:text-3xl text-black/90 dark:text-white/90' >{currentCode !== 'pl' ? t('currencySymbol') : ""}{currentCode === 'pl' ? convertPriceToPLN(shoe.price) : shoe.price + ",00"} {currentCode === 'pl' ? t('currencySymbol') : ""}</p>
                                </div>
                                <p className='text-lg xl:text-xl text-black/90 dark:text-white/90 mb-3 mt-8'>{t('shoeView.selectSize')}</p>

                                <div className='grid grid-cols-3 xl:grid-cols-4 mt-2 gap-y-2 gap-x-1 w-[15rem] xl:w-[22rem] '>
                                    {shoe.sizes.map((size) => (
                                        <label key={size.size} className={` ${size.quantity === 0 ? 'cursor-auto' : 'cursor-pointer'}`}>
                                            <input type="checkbox"
                                                className="peer sr-only"
                                                name="sizeChoice"
                                            />
                                            <div className={` flex justify-center space-x-1 items-center rounded w-[4rem] h-[2rem] xl:w-[5rem] xl:h-[3rem] text-black/80 dark:text-white  shadow-md ${size.quantity === 0 ? 'bg-black/10 ' : 'bg-white dark:bg-black/30 transition-all active:scale-95 peer-checked:bg-[#97DEFF] peer-checked:text-black/80'} `}>
                                                <p >{currentCode !== 'pl' ? "US" : "EU"}</p>
                                                <p >{t(`sizes.${size.size}`)}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <div className='flex space-x-4 mt-10'>
                                    <button className='py-3 px-6 rounded-lg shadow-lg bg-[#97DEFF] transform hover:scale-105 ease-in-out duration-300'>
                                        <p className='text-lg'>{t('shoeView.cart')}</p>
                                    </button>
                                    <button onClick={handleHeartClick} className='py-3 px-4 rounded-lg shadow-lg border-2 border-white transform hover:scale-105 ease-in-out duration-300'>
                                        {shoe.isHearted ? (<AiFillHeart size={25} color={"#f54e4e"} />) : (<AiOutlineHeart size={25} color={theme === 'dark' ? "white" : "black"} />)}


                                    </button>
                                </div>

                                <div className='space-y-4 mt-10 text-black/80 dark:text-white/80'>
                                    <div className='flex items-center space-x-3'>
                                        <div className='w-[1.2rem] h-[1.2rem] rounded-full bg-green-600'></div>
                                        <p>{t('shoeView.ship')}</p>
                                    </div>
                                    <div className='flex items-center space-x-3'>
                                        <BsTruck size={20} />
                                        <p>{t('shoeView.ship2')}</p>
                                    </div>
                                    <div className='flex items-center space-x-3'>
                                        < BsShield size={20} />
                                        <p>{t('shoeView.secure')}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>)

                }

            </div>
        </div>
    );
}

export default ShoeView;