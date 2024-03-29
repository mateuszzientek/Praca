import React, { ReactNode } from "react";

interface ShopInfoProps {
  icon: ReactNode;
  border: string;
  text1: string;
  text2: string;
}

function ShopInfo(props: ShopInfoProps) {
  return (
    <div className="flex items-center pr-4">
      {props.icon}
      <div
        className={`sm:flex text-center ${props.border} border-black dark:border-white pr-2`}
      >
        <h2 className="md:text-sm lg:text-lg pc:text-xl px-1 text-black dark:text-white">
          {props.text1}
        </h2>
        <h2 className="md:text-sm lg:text-lg pc:text-xl flex px-1 text-black dark:text-white">
          {props.text2}
        </h2>
      </div>
    </div>
  );
}

export default ShopInfo;
