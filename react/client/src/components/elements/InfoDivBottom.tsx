import React from 'react';

interface InfoDivBottomProps {
  text: string
}

function InfoDivBottom(props: InfoDivBottomProps) {
  return (
    <div className='z-10 fixed bg-green-500 w-[70%] md:w-auto rounded-full  bottom-10 flex justify-center items-center  animate-fade-in-infoDiv'>
      <p className='text-white p-4 text-lg text-center'>{props.text}</p>
    </div >
  );
}

export default InfoDivBottom;