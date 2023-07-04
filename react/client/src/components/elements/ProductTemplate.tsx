import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../elements/ThemeContext';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { ref, getDownloadURL } from "firebase/storage";
import storage from '../../firebase';
import axios from 'axios';

interface Shoe {
    _id: string;
    name: string;
    category: string;
    price: number;
    image: string;
}

function ProductTemplate() {

    const { theme, setTheme } = useContext(ThemeContext);
    const [but, setBut] = useState('');
    const [heart, setHeart] = useState(false)
    const [shoes, setShoes] = useState<Shoe[]>([]);

    const handleHeartClick = () => {
        setHeart(!heart)
    }

    useEffect(() => {

        const pathReference = ref(storage, 'but.png');

        getDownloadURL(pathReference)
            .then((url) => {
                setBut(url)
            })
            .catch((error) => {
                console.log(error)
            });
    }, []);

    useEffect(() => {
        axios
            .get("/shoes")
            .then((response) => {
                setShoes(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    console.log(shoes)




    return (
        <>
            {shoes.map((shoe) =>
                <div key={shoe._id} className='w-[15rem] h-[20rem] rounded-lg shadow-xl cursor-pointer hover:scale-105 transform ease-in-out duration-500 '>

                    <div className='flex relative items-center justify-center bg-[#fafafa] dark:bg-black/50 w-full h-[70%] rounded-t-lg border-[1px] border-black/10 dark:border-white/20  '>
                        <div onClick={handleHeartClick}>
                            {heart ? (
                                <AiFillHeart size={25} color={"#f54e4e"} className='absolute top-4 right-4 cursor-pointer' />
                            ) : (
                                <AiOutlineHeart size={25} color={theme === 'dark' ? "white" : "black"} className='absolute top-4 right-4 cursor-pointer' />
                            )}
                        </div>

                        <img src={but} className='scale-75 -rotate-17 mr-6 mt-6' />

                    </div>

                    <div className='flex flex-col bg-white dark:bg-black/60 w-full font-lato h-[30%] rounded-b-lg justify-center space-y-1 pl-3'>
                        <p className='text-sm text-black/50 dark:text-white/50'>{shoe.category}</p>
                        <p className='text-base text-black dark:text-white'>{shoe.name}</p>
                        <div className='flex items-center text-black/50 font-lato space-x-2'>
                            <p className='line-through text-black dark:text-white'>$140,00</p>
                            <p className='text-black dark:text-white font-bold pr-4'>{shoe.price}</p>
                        </div>
                    </div>

                </div>
            )}
        </>
    );
}

export default ProductTemplate;