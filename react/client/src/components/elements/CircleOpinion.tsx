import React from 'react';

interface CircleOpinionProps {
  text: string;
  main_text: string;
}

const CircleOpinion: React.FC<CircleOpinionProps> = (props) => {
  return (
    <div className='flex flex-col items-center w-48 '>
      <div className='scale-animation flex justify-center items-center circle-background w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full shadow-2xl text-2xl  lg:text-4xl font-bold '>
        <h2 className=''>{props.text}</h2>
      </div>
      <h2 className='text-lg lg:text-2xl mt-5 font-bold text-black dark:text-white'>{props.main_text}</h2>
    </div>
  );
}

export default CircleOpinion;
