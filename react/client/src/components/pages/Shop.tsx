import React, { useState, useEffect } from 'react';
import Navbar from '../sections/Navbar';
import { AiOutlineDown } from 'react-icons/ai';
import { BiFilterAlt } from 'react-icons/bi';
import ProductTemplate from '../elements/ProductTemplate';
import FilterSection from '../sections/FilterSection';
import axios from 'axios';
import { ref, getDownloadURL } from "firebase/storage";
import storage from '../../firebase';

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

    const numbers = Array.from({ length: 11 }, (_, index) => 36 + index);
    const [showFilter, setShowFilter] = useState(false)
    const categories = ['Sneakersy wysokie', 'Sneakersy niskie', 'Buty sportowe'];
    const brands = ['All products', 'Nike', 'Adidas', 'New Balance'];
    const priceRanges = [
        { label: '$0 - $50', value: 'range1' },
        { label: '$50 - $100', value: 'range2' },
        { label: '$100 - $150', value: 'range3' },
        { label: 'Over $150', value: 'range4' },
    ];

    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(0)
    const [shoes, setShoes] = useState<Shoe[]>([]);


    const handleClickFilter = () => {
        setShowFilter(!showFilter)
    }

    useEffect(() => {
        const fetchShoes = async () => {
            try {
                const response = await axios.get(`/shoes?page=${page}`);
                const fetchedShoes: any[] = response.data;
                const shoeImages = await Promise.all(
                    fetchedShoes.map(async (shoe) => {
                        const pathReference = ref(storage, shoe.image);
                        const url = await getDownloadURL(pathReference);
                        return {
                            ...shoe,
                            imageUrl: url,
                        };
                    })
                );
                const shuffledShoes = shoeImages.sort(() => Math.random() - 0.5);
                setShoes(shuffledShoes as Shoe[]);
            } catch (error) {
                console.log(error);
            }
        };

        fetchShoes();
    }, []);

    const handleHeartClick = (shoe: Shoe) => {
        setShoes(prevShoes => {
            const updatedShoes = prevShoes.map(prevShoe => {
                if (prevShoe._id === shoe._id) {
                    return {
                        ...prevShoe,
                        isHearted: !prevShoe.isHearted
                    };
                }
                return prevShoe;
            });
            return updatedShoes;
        });
    }

    const handlePrevious = () => {
        setPage((p) => {
            if (p === 1) return p;
            return p - 1;
        })
    }

    const handleNext = () => {
        setPage((p) => {
            if (p === pageCount) return p;
            return p + 1;
        })
    }

    console.log(shoes)

    return (
        <>
            {showFilter && (<FilterSection showFilter={showFilter} setShowFilter={setShowFilter} />)}
            <Navbar background="bg-white" extra="z-10 border-b-[2px] border-black/10 dark:border-white" shadow="none" />
            <div className='flex justify-center   xl:px-12 2xl:px-20 bg-white dark:bg-[#292929] min-h-screen '>

                <div className='hidden lg:flex flex-col items-center w-[270px] min-w-[270px] h-auto  border-r-[2px] dark:border-white border-black/10'>
                    <div className='text-left '>
                        <p className='mt-10 text-xl mb-4 text-black dark:text-white'>Category</p>

                        <div className='flex flex-col space-y-3'>
                            {categories.map((category, index) => (
                                <label key={index} className="cursor-pointer flex">
                                    <input type="radio" className="peer sr-only" name="pricing" />
                                    <div className="w-5 h-5 border-2 border-black/20 dark:border-white rounded-full transition-all peer-checked:bg-black/80 dark:peer-checked:bg-white"></div>
                                    <p className='px-4 text-black/60 dark:text-white'>{category}</p>
                                </label>
                            ))}
                        </div>

                        <div className='mt-6 w-[10rem] h-[0.2rem] bg-black/10 dark:bg-white'></div>

                        <p className='mt-6 text-xl mb-4 text-black dark:text-white'>Price</p>

                        <div className='flex flex-col space-y-3'>
                            {priceRanges.map((range, index) => (
                                <label key={index} className="cursor-pointer flex">
                                    <input type="radio" className="peer sr-only" name="price" value={range.value} />
                                    <div className="w-5 h-5 border-2 border-black/20 dark:border-white rounded-full transition-all peer-checked:bg-black/80 dark:peer-checked:bg-white"></div>
                                    <p className='px-4 text-black/60 dark:text-white'>{range.label}</p>
                                </label>
                            ))}
                        </div>

                        <div className='flex mt-4'>
                            <div className='flex flex-col items-center'>
                                <input className='w-[3.5rem] h-[2rem] border-2 border-black/20 rounded-md focus:outline-none text-center' placeholder='0' />
                                <p className='text-black/60 dark:text-white'>min</p>
                            </div>

                            <div className='w-[1.5rem] h-[0.2rem] bg-black/20 mx-2 mt-4 dark:bg-white'></div>

                            <div className='flex flex-col items-center'>
                                <input className='w-[3.5rem] h-[2rem] border-2 border-black/20 rounded-md focus:outline-none text-center' placeholder='0' />
                                <p className='text-black/60 dark:text-white'>max</p>
                            </div>

                        </div>

                        <div className='mt-6 w-[10rem] h-[0.2rem] bg-black/10 dark:bg-white'></div>

                        <p className='mt-6 text-xl mb-4 text-black dark:text-white'>Size</p>

                        <div className='grid grid-cols-4 mt-2 gap-y-2 gap-x-2 '>
                            {numbers.map(number => (
                                <label key={number} className="inline-block cursor-pointer">
                                    <input type="checkbox" className="peer sr-only" name="size-choice" />
                                    <div className="flex justify-center items-center w-[2.5rem] h-[2.5rem] border-2 border-black/20 rounded-lg bg-white shadow-md transition-all active:scale-95 peer-checked:bg-[#97DEFF] peer-checked:border-none">
                                        <p className='text-black/80'>{number}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <div className='flex justify-center'>
                            <button className='px-2 py-1 border-2 border-black/60 text-black dark:text-white dark:border-white rounded-lg mt-6 hover:scale-105 transform ease-in-out duration-500 '>
                                <p>Zastosuj</p>
                            </button>
                        </div>

                    </div>

                </div>

                <div className='flex flex-col h-full w-[100rem] pb-10'>

                    <p className=' text-black/80 dark:text-white text-3xl px-12 py-10 text-center lg:text-left '>All products</p>
                    <div className='flex justify-between '>
                        <div className='hidden lg:flex px-12 space-x-4'>

                            {brands.map(brand => (
                                <label key={brand} className="cursor-pointer ">
                                    <input type="radio" className="peer sr-only" name="brand" defaultChecked={brand === 'All products'} />
                                    <div className="flex  items-center px-2 h-[3rem] w-auto border-[2px] border-black/10 dark:border-white text-black/60 dark:text-white  rounded-md peer-checked:bg-[#97DEFF] peer-checked:text-black/60  peer-checked:border-none hover:scale-105 transform ease-in-out duration-500">
                                        <p>{brand}</p>
                                    </div>
                                </label>
                            ))}


                        </div>

                        <button onClick={handleClickFilter} className='flex lg:hidden ml-12 space-x-1  items-center justify-center px-2 h-[3rem] border-[2px] border-black/10 dark:border-white dark:text-white  text-black/60 rounded-md '>
                            <p>Filtr</p>
                            <BiFilterAlt size={15} />
                        </button>



                        <div className='flex '>
                            <button className='flex space-x-1 xl:mr-20 mr-12  2xl:mr-12 items-center justify-center px-2 h-[3rem] border-[2px] border-black/10 dark:border-white dark:text-white  text-black/60 rounded-md '>
                                <p>Newest</p>
                                <AiOutlineDown size={15} />
                            </button>
                        </div>
                    </div>

                    <div className='justify-center mx-auto gap-10 px-12 grid sm:grid-cols-2 min-[1150px]:grid-cols-3 lg:gap-x-10  2xl:grid-cols-4 min-[1920px]:grid-cols-5 mt-10 gap-y-10 xl:gap-x-14'>
                        {shoes.map((shoe) =>
                            <div key={shoe._id}>
                                <ProductTemplate
                                    shoe={shoe}
                                    isHearted={shoe.isHearted}
                                    imageUrl={shoe.imageUrl || ""}
                                    discountPrice={shoe.discountPrice}
                                    price={shoe.price}
                                    name={shoe.name}
                                    handleHeartClick={handleHeartClick}
                                    category={shoe.category} />
                            </div>
                        )}
                    </div>
                    <div className='flex justify-center space-x-10 mt-10'>
                        <button disabled={page === 1} onClick={handlePrevious} >Previous</button>
                        <button disabled={page === pageCount} onClick={handleNext} className=''>Next</button>

                    </div>

                </div>

            </div >

        </ >
    );
}

export default Shop;