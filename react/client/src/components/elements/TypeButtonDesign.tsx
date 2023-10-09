import React from "react";

interface TypeButtonDesignProps {
  index: number;
  selectedType: number | null;
  onClick: (index: number) => void;
  icon: React.ReactNode;
}

function TypeButtonDesign(props: TypeButtonDesignProps) {
  return (
    <div
      className={`bg-white dark:bg-white/70 rounded-lg p-8 border-2 ${
        props.selectedType === props.index
          ? "border-black/80 dark:border-white "
          : "cursor-pointer border-black/30 dark:border-none"
      }`}
      onClick={() => props.onClick(props.index)}
    >
      {props.icon}
    </div>
  );
}

export default TypeButtonDesign;
