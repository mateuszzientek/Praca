import React from 'react';
import CircleOpinion from './CircleOpinion';
import SlideOpinions from './SlideOpinions';

function OpinionSection() {
    return (
        <div className='h-[65rem] tloo font-roboto '>

            {/* main text */}

            <div>
                <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center pt-28 mb-6'>Why You Should Choose Us?</h2>
                <div className='bg-black h-[0.3rem] w-[20rem] md:w-[25rem] lg:w-[32rem] m-auto rounded-full'></div>
            </div>

            {/* circle opinion*/}

            <div className='flex flex-col space-y-6 md:space-y-0 md:flex-row justify-center mt-16 md:mt-20 lg:mt-28 lg:space-x-12 xl:space-x-20 mb-10 md:mb-20 ' >

                <div className='flex justify-center lg:space-x-12  xl:space-x-20'>
                    <CircleOpinion text="+1M" main_text="Sales in a Year" />
                    <CircleOpinion text="+2M" main_text="Customers" />
                </div>
                <div className='flex justify-center lg:space-x-12  xl:space-x-20 '>
                    <CircleOpinion text="+100K" main_text="Created Projects" />
                    <CircleOpinion text="+10K" main_text="Positive Reviews" />
                </div>
            </div>

            {/* slider for opinions*/}

            <SlideOpinions />
        </div>
    );
}

export default OpinionSection;

