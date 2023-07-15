import React, { ReactNode } from 'react';

interface RoundIconProps {
  icon: ReactNode;
  extra?: string;
}

function RoundIcon(props: RoundIconProps) {

  const iconClassName = `hidden lg:flex bg-[#97DEFF] rounded-full ml-4 p-2 shadow-xl my-4 transform hover:scale-125 hover:bg-opacity-75 transition ease-out duration-300 ${props.extra}`;

  return (
    <div className={iconClassName}>
      {props.icon}
    </div>
  );
}

export default RoundIcon;