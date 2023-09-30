import React, { useState } from 'react';
import { IoColorFillOutline, IoTextOutline } from "react-icons/io5";
import { BsFlower1 } from "react-icons/bs";
import { AiOutlinePicture, AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

interface DesignSectionProps {
    onDesignFinish: () => void
    photos: string[]
}

function DesignSection(props: DesignSectionProps) {

    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const textArray = ["Tip", "Quarter", "Swoosh", "Heel", "Second Quarter", "Second Swoosh", "Second Heel", "Toe", "Heel Logo"];

    const handleNextText = () => {
        setCurrentTextIndex((prevIndex: number) => (prevIndex + 1) % textArray.length);
    };

    const handlePreviousText = () => {
        setCurrentTextIndex((prevIndex: number) =>
            prevIndex === 0 ? textArray.length - 1 : prevIndex - 1
        );
    };

    const renderImageSource = () => {
        if (currentTextIndex < 4) {
            return props.photos[0];
        } else if (currentTextIndex >= 4 && currentTextIndex < 7) {
            return props.photos[1];
        } else if (currentTextIndex === 7) {
            return props.photos[2];
        } else {
            return props.photos[3];
        }
    };

    return (
        <div className='w-full '>

            <button onClick={props.onDesignFinish} className='absolute top-10 left-10 text-black px-6 py-3 rounded-full border-2 border-black/60 hover:bg-black hover:text-white'>
                <p className='text-lg'>Finish Editing</p>
            </button>

            <div className='flex bg-[rgb(239,239,239)] h-[45rem]'>
                <div className='flex justify-center items-center w-[70%] border-r-2 border-black/20'>
                    <img className='h-[35rem] object-fill' src={renderImageSource()} />
                </div>
                <div className='w-30% mx-auto mt-10'>
                    <div className="flex space-x-4">
                        <div className="bg-white rounded-lg p-8">
                            <IoColorFillOutline size={35} />
                        </div>
                        <div className="bg-white rounded-lg p-8">
                            <IoTextOutline size={35} />
                        </div>
                        <div className="bg-white rounded-lg p-8">
                            <AiOutlinePicture size={35} />
                        </div>
                        <div className="bg-white rounded-lg p-8">
                            <BsFlower1 size={35} />
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex w-[24rem] mx-auto justify-between items-center  mt-10'>

                <AiOutlineArrowLeft size={30} className='cursor-pointer' onClick={handlePreviousText} />

                <div className='flex space-x-2'>
                    <p className='text-xl text-black font-medium'>{textArray[currentTextIndex]}</p>
                    <p className='text-xl text-black/50 font-medium'>{`${currentTextIndex + 1}/${textArray.length}`}</p>
                </div>

                <AiOutlineArrowRight size={30} className='cursor-pointer' onClick={handleNextText} />
            </div>




        </div>
    );
}

export default DesignSection;