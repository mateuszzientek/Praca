import React, { useState } from "react";
import { ChromePicker } from "react-color";
import { AiOutlineClose } from "react-icons/ai";
import { useTranslation } from "react-i18next";

interface ColoPickerTextDivProps {
  setShowDiv: (newState: string) => void;
  color: any;
  selectedColorType: "left" | "right";
  selectedColors: any;
  setSelectedColors: (updatedColors: any) => void;
  setSideView: (side: string) => void;
}

function ColoPickerTextDiv(props: ColoPickerTextDivProps) {

  const { t } = useTranslation();

  const [selectedColorTemporary, setSelectedColorTemporary] = useState({
    rgb: props.color,
  });

  const handleColorChange = (newColor: any) => {
    setSelectedColorTemporary({ rgb: newColor.rgb });
  };

  const handleSubmit = () => {
    const updatedColors = { ...props.selectedColors };

    if (props.selectedColorType === "left") {
      updatedColors.selectedColorLeftText = selectedColorTemporary;
    } else if (props.selectedColorType === "right") {
      updatedColors.selectedColorRightText = selectedColorTemporary;
    }

    props.setSideView(props.selectedColorType);
    props.setSelectedColors(updatedColors);
    props.setShowDiv("");
  };

  return (
    <div className="bg-black/50 backdrop-blur-sm fixed w-full h-screen z-20 flex justify-center items-center min-h-screen overflow-y-auto ">
      <div className="relative flex flex-col text-black dark:text-white justify-center items-center w-[30rem] h-[30rem] bg-white dark:bg-[#757575] rounded-lg max-h-[80vh] overflow-y-auto">
        <div className="flex flex-col max-h-[80vh] pt-4">
          <AiOutlineClose
            onClick={() => props.setShowDiv("")}
            className="cursor-pointer absolute top-6 right-6"
            size={30}
          />
          <ChromePicker
            color={selectedColorTemporary.rgb}
            onChange={handleColorChange}
          />

          <button
            onClick={handleSubmit}
            className="w-[60%] mx-auto mt-10 px-4 py-3 rounded-lg text-black bg-white dark:bg-[#3b3b3b] dark:text-white border-2 border-black/60 dark:border-white/70 hover:bg-black/80 hover:text-white hover:dark:text-black hover:dark:bg-white "
          >
            <p className="text-xl">{t("designSection.text22")}</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ColoPickerTextDiv;
