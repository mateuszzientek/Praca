import React from "react";

interface RoundedColorInterface {
  color: any;
  background: string;
  onClick: (color: any) => void;
  isSelected: boolean;
}

function RoundedColor(props: RoundedColorInterface) {
  const handleColorClick = () => {
    if (props.isSelected) {
      return;
    }
    props.onClick(props.color);
  };

  return (
    <div
      onClick={handleColorClick}
      className={`w-[2.5rem] h-[2.5rem] ${
        props.background
      } rounded-full mr-4 mt-8 shadow-lg  ${
        props.isSelected
          ? "cursor-auto outline-none ring ring-offset-[0.2rem] ring-offset-[rgb(239,239,239)] dark:ring-offset-[#3b3b3b] ring-black/10 dark:ring-white/30"
          : "cursor-pointer"
      }`}
    ></div>
  );
}

export default RoundedColor;
