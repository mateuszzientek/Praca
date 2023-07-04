import React, { useEffect, useContext } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { ThemeContext } from '../elements/ThemeContext';

interface FilterSectionProps {
    showFilter: boolean
    setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

function FilterSection(props: FilterSectionProps) {
    const { theme, setTheme } = useContext(ThemeContext);

    const numbers = Array.from({ length: 11 }, (_, index) => 36 + index);
    const categories = ['Sneakersy wysokie', 'Sneakersy niskie', 'Buty sportowe'];
    const brands = ['All products', 'Nike', 'Adidas', 'New Balance'];
    const priceRanges = [
        { label: '$0 - $50', value: 'range1' },
        { label: '$50 - $100', value: 'range2' },
        { label: '$100 - $150', value: 'range3' },
        { label: 'Over $150', value: 'range4' },
    ];

    useEffect(() => {
        if (props.showFilter) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        // Clean up the effect
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

                    <div className='justify-start grid grid-cols-2 gap-4 mt-10'>

                        {brands.map(brand => (
                            <label key={brand} className="cursor-pointer ">
                                <input type="radio" className="peer sr-only" name="brand" defaultChecked={brand === 'All products'} />
                                <div className="flex items-center px-2 h-[3rem]  border-[2px] border-black/10 dark:border-white text-black/60 dark:text-white  rounded-md peer-checked:bg-[#97DEFF] peer-checked:text-black/60  peer-checked:border-none hover:scale-105 transform ease-in-out duration-500">
                                    <p>{brand}</p>
                                </div>
                            </label>
                        ))}


                    </div>

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

                    <div className='mt-6 w-full h-[0.2rem] bg-black/10 dark:bg-white '></div>

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

                    <div className='mt-6 w-full h-[0.2rem] bg-black/10 dark:bg-white'></div>

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

                    <button className='mx-auto px-2 py-1 border-2 border-black/60 text-black dark:text-white dark:border-white rounded-lg mt-6 hover:scale-105 transform ease-in-out duration-500 '>
                        <p>Zastosuj</p>
                    </button>


                </div>

            </div>
        </>
    );
}

export default FilterSection;