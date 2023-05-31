import React, { ReactNode } from 'react';


interface RoundIconProps {
  icon: ReactNode;
}

function RoundIcon(props: RoundIconProps) {
  return (
    <div className='hidden lg:flex bg-[#97DEFF] rounded-full ml-4 p-2 shadow-xl transform hover:scale-125 hover:bg-opacity-75 transition ease-out duration-300'>
      {props.icon}
    </div>
  );
}

export default RoundIcon;
