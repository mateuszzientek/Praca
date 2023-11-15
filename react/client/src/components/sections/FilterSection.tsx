import React, { useEffect, useContext, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { ThemeContext } from '../elements/ThemeContext';
import { FilterContext } from '../elements/FilterProvider';
import { useTranslation } from 'react-i18next';
import validator from 'validator';


interface FilterSectionProps {
    showFilter: boolean
    setShowFilter: React.Dispatch<React.SetStateAction<boolean>>
}

function FilterSection(props: FilterSectionProps) {
    const currentCode = localStorage.getItem('i18nextLng')
    const { t } = useTranslation();
    const { theme } = useContext(ThemeContext);
    const {
        selectedBrand,
        setSelectedBrand,
        selectedCategory,
        setSelectedCategory,
        selectedPrice,
        setSelectedPrice,
        setSelectedMin,
        selectedSizes,
        setSelectedSizes,
        searchTerm,
        setSearchTerm } = useContext(FilterContext);

    //////////Variables/////////////

    const sizes = Array.from({ length: 11 }, (_, index) => 36 + index);
    const categories = ['high', 'low', 'sport'];
    const brands = ['All', 'Nike', 'Adidas', 'New Balance'];
    const priceRanges = ['range1', 'range2', 'range3', 'range4'];
    const [currentMin, setCurrentMin] = useState("")

    /////////Functions//////////

    const handleBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedBrand = event.target.value;
        setSelectedBrand(selectedBrand);
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedCategory = event.target.value;
        setSelectedCategory(selectedCategory);
    };

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedPrice = event.target.value;
        setSelectedPrice(selectedPrice);
    };

    const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentMin(event.target.value);
    };

    const handleSizesChange = (event: React.ChangeEvent<HTMLInputElement>, size: string) => {
        if (event.target.checked) {
            setSelectedSizes((prevSizes) => [...prevSizes, size]);
        } else {
            setSelectedSizes((prevSizes) => prevSizes.filter((size_) => size_ !== size));
        }
    };

    const handleMinBlur = () => {
        if (currentMin && validator.isNumeric(currentMin) && parseInt(currentMin) > 0) {
            if (currentCode === 'pl') {
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

    const handleReset = () => {
        setSelectedCategory('')
        setSelectedPrice('')
        setSelectedMin('')
        setCurrentMin("")
        setSelectedSizes([])
    }

    const formatSearchTerm = (term: string) => {
        if (!term) return ''; // Return an empty string if searchTerm is empty

        return term.charAt(0).toUpperCase() + term.slice(1);
    };

    const handleClickRemoveSearchTerm = () => {
        localStorage.removeItem("searchTerm");
        setSearchTerm("");
    };

    /////////UseEffects///////////

    useEffect(() => {
        if (props.showFilter) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [props.showFilter]);

    return (
        <>
            {props.showFilter ? <div className='bg-black/80 fixed w-full h-screen z-10 top-0 left-0'></div> : ''}
            <div className={props.showFilter ? 'fixed top-0 left-0 w-screen h-screen overflow-y-auto   bg-white dark:bg-black z-10  duration-500 slide-in-bottom ' : ''}>
                <AiOutlineClose onClick={() => props.setShowFilter(!props.showFilter)} size={25} color={theme === 'dark' ? "white" : "black"} className='absolute right-10 top-10 cursor-pointer' />

                <div className='flex flex-col items-start ml-10 mb-10'>

                    {searchTerm && (
                        <div className="flex items-center mt-10 space-x-4">
                            <p className="text-2xl text-black dark:text-white">
                                {formatSearchTerm(searchTerm)}
                            </p>
                            <div onClick={handleClickRemoveSearchTerm} className="cursor-pointer">
                                <AiOutlineClose size={30} color={theme === "dark" ? "white" : "black"} />
                            </div>
                        </div>)}

                    <div className='justify-start grid grid-cols-2 gap-4 mt-10'>

                        {brands.map(brand => (
                            <label key={brand} className="cursor-pointer ">
                                <input
                                    type="radio"
                                    className="peer sr-only"
                                    name="brand"
                                    value={brand}
                                    onChange={handleBrandChange}
                                    checked={brand === selectedBrand} />
                                <div className="flex justify-center items-center px-2 h-[3rem]  border-[2px] border-black/10 dark:border-white text-black/60 dark:text-white  rounded-md peer-checked:bg-[#97DEFF] peer-checked:text-black/60  peer-checked:border-none hover:scale-105 transform ease-in-out duration-500">
                                    <p>{brand === "All" ? t('shop.all') : brand}</p>
                                </div>
                            </label>
                        ))}


                    </div>

                    <p className='mt-10 text-xl mb-4 text-black dark:text-white'>{t('shop.category')}</p>

                    <div className='flex flex-col space-y-3'>
                        {categories.map((category, index) => (
                            <label key={index} className="cursor-pointer flex">
                                <input
                                    type="radio"
                                    className="peer sr-only"
                                    name="category"
                                    value={category}
                                    onChange={handleCategoryChange}
                                    checked={category === selectedCategory} />
                                <div className="w-5 h-5 border-2 border-black/20 dark:border-white rounded-full transition-all peer-checked:bg-black/80 dark:peer-checked:bg-white"></div>
                                <p className='px-4 text-black/60 dark:text-white'>{t(`categoryShoes.${category}`)}</p>
                            </label>
                        ))}
                    </div>

                    <div className='mt-6 w-full h-[0.2rem] bg-black/10 dark:bg-white '></div>

                    <p className='mt-6 text-xl mb-4 text-black dark:text-white'>{t('shop.price')}</p>

                    <div className='flex flex-col space-y-3'>
                        {priceRanges.map((range, index) => (
                            <label key={index} className="cursor-pointer flex">
                                <input
                                    type="radio"
                                    className="peer sr-only"
                                    name="price"
                                    value={range}
                                    onChange={handlePriceChange}
                                    checked={range === selectedPrice} />
                                <div className="w-5 h-5 border-2 border-black/20 dark:border-white rounded-full transition-all peer-checked:bg-black/80 dark:peer-checked:bg-white"></div>
                                <p className='px-4 text-black/60 dark:text-white'>{t(`priceRange.${range}`)}</p>
                            </label>
                        ))}
                    </div>

                    <div className='flex mt-4'>
                        <div className='flex flex-col items-center'>
                            <input
                                className='w-[3.5rem] h-[2rem] border-2 border-black/20 rounded-md focus:outline-none text-center'
                                placeholder='0'
                                onChange={handleMinChange}
                                onBlur={handleMinBlur}
                                value={currentMin} />
                            <p className='text-black/60 dark:text-white'>min</p>
                        </div>

                        <div className='w-[1.5rem] h-[0.2rem] bg-black/20 mx-2 mt-4 dark:bg-white'></div>

                        <div className='flex flex-col items-center'>
                            <input className='w-[3.5rem] h-[2rem] border-2 border-black/20 rounded-md focus:outline-none text-center' placeholder='0' />
                            <p className='text-black/60 dark:text-white'>max</p>
                        </div>

                    </div>

                    <div className='mt-6 w-full h-[0.2rem] bg-black/10 dark:bg-white'></div>

                    <p className='mt-6 text-xl mb-4 text-black dark:text-white'>{t('shop.size')}</p>

                    <div className='grid grid-cols-4 mt-2 gap-y-2 gap-x-2 '>
                        {sizes.map(size => (
                            <label key={size} className="inline-block cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="peer sr-only"
                                    name="size-choice"
                                    onChange={(event) => handleSizesChange(event, size.toString())}
                                    checked={selectedSizes.includes(size.toString())} />
                                <div className="flex justify-center items-center w-[2.5rem] h-[2.5rem] border-2 border-black/20 rounded-lg bg-white shadow-md transition-all active:scale-95 peer-checked:bg-[#97DEFF] peer-checked:border-none">
                                    <p className='text-black/80'>{size}</p>
                                </div>
                            </label>
                        ))}
                    </div>

                    <button onClick={handleReset} className='mx-auto px-2 py-1 border-2 border-black/60 text-black dark:text-white dark:border-white rounded-lg mt-6 hover:scale-105 transform ease-in-out duration-500 '>
                        <p>{t('shop.reset')}</p>
                    </button>


                </div>

            </div>
        </>
    );
}

export default FilterSection;