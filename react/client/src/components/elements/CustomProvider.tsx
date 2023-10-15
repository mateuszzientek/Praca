import React, { createContext, useContext, useState, ReactNode } from "react";

interface CustomContextProps {
  selectedColors: {
    selectedColorSwosh_1: { rgb: { r: number; g: number; b: number } };
    selectedColorTip_1: { rgb: { r: number; g: number; b: number } };
    selectedColorHill_1: { rgb: { r: number; g: number; b: number } };
    selectedColorQuarter_1: { rgb: { r: number; g: number; b: number } };
    selectedColorHeel_logo_1: { rgb: { r: number; g: number; b: number } };
    selectedColorToe_1: { rgb: { r: number; g: number; b: number } };
    selectedColorEyestay_1: { rgb: { r: number; g: number; b: number } };
    selectedColorQuarter_2: { rgb: { r: number; g: number; b: number } };
    selectedColorSwosh_2: { rgb: { r: number; g: number; b: number } };
    selectedColorHeel_2: { rgb: { r: number; g: number; b: number } };
    selectedColorEyestay_2: { rgb: { r: number; g: number; b: number } };
  };
  setSelectedColors: (colors: {
    selectedColorSwosh_1: { rgb: { r: number; g: number; b: number } };
    selectedColorTip_1: { rgb: { r: number; g: number; b: number } };
    selectedColorHill_1: { rgb: { r: number; g: number; b: number } };
    selectedColorQuarter_1: { rgb: { r: number; g: number; b: number } };
    selectedColorHeel_logo_1: { rgb: { r: number; g: number; b: number } };
    selectedColorToe_1: { rgb: { r: number; g: number; b: number } };
    selectedColorEyestay_1: { rgb: { r: number; g: number; b: number } };
    selectedColorQuarter_2: { rgb: { r: number; g: number; b: number } };
    selectedColorSwosh_2: { rgb: { r: number; g: number; b: number } };
    selectedColorHeel_2: { rgb: { r: number; g: number; b: number } };
    selectedColorEyestay_2: { rgb: { r: number; g: number; b: number } };
  }) => void;
  selectedPatches: {
    selectedLeftPatch: string;
    selectedRightPatch: string
  };
  setSelectedPatches: (patch: {
    selectedLeftPatch: string;
    selectedRightPatch: string
  }) => void;
  selectedColorsText: {
    selectedColorLeftText: { rgb: { r: number; g: number; b: number } };
    selectedColorRightText: { rgb: { r: number; g: number; b: number } };
  };
  setSelectedColorsText: (colors: {
    selectedColorLeftText: { rgb: { r: number; g: number; b: number } };
    selectedColorRightText: { rgb: { r: number; g: number; b: number } };
  }) => void;
  leftSideImageCropped: File | null;
  rightSideImageCropped: File | null;
  setLeftSideImageCropped: (image: File | null) => void;
  setRightSideImageCropped: (image: File | null) => void;
  isLeftSwooshVisible: boolean
  isRightSwooshVisible: boolean
  setIsLeftSwooshVisible: (newState: boolean) => void;
  setIsRightSwooshVisible: (newState: boolean) => void;
  leftSideText: string
  rightSideText: string
  setLeftSideText: (newState: string) => void;
  setRightSideText: (newState: string) => void;

}
interface CustomContextProviderChildren {
  children: ReactNode;
}

const CustomContext = createContext<CustomContextProps>(
  {} as CustomContextProps
);

// Utwórz dostawcę kontekstu, który będzie zawierać stan wybranych kolorów
const CustomProvider: React.FC<CustomContextProviderChildren> = ({
  children,
}) => {
  const [selectedColors, setSelectedColors] = useState({
    selectedColorSwosh_1: { rgb: { r: 255, g: 255, b: 255 } },
    selectedColorTip_1: { rgb: { r: 255, g: 255, b: 255 } },
    selectedColorHill_1: { rgb: { r: 255, g: 255, b: 255 } },
    selectedColorQuarter_1: { rgb: { r: 255, g: 255, b: 255 } },
    selectedColorHeel_logo_1: { rgb: { r: 255, g: 255, b: 255 } },
    selectedColorToe_1: { rgb: { r: 255, g: 255, b: 255 } },
    selectedColorEyestay_1: { rgb: { r: 255, g: 255, b: 255 } },
    selectedColorQuarter_2: { rgb: { r: 255, g: 255, b: 255 } },
    selectedColorSwosh_2: { rgb: { r: 255, g: 255, b: 255 } },
    selectedColorHeel_2: { rgb: { r: 255, g: 255, b: 255 } },
    selectedColorEyestay_2: { rgb: { r: 255, g: 255, b: 255 } },
  });
  const [selectedColorsText, setSelectedColorsText] = useState({
    selectedColorLeftText: { rgb: { r: 0, g: 0, b: 0 } },
    selectedColorRightText: { rgb: { r: 0, g: 0, b: 0 } },
  });
  const [selectedPatches, setSelectedPatches] = useState({
    selectedLeftPatch: "",
    selectedRightPatch: "",
  });
  const [leftSideImageCropped, setLeftSideImageCropped] = useState<File | null>(
    null
  );
  const [rightSideImageCropped, setRightSideImageCropped] = useState<File | null>(
    null
  );
  const [isLeftSwooshVisible, setIsLeftSwooshVisible] = useState(true);
  const [isRightSwooshVisible, setIsRightSwooshVisible] = useState(true);
  const [leftSideText, setLeftSideText] = useState("");
  const [rightSideText, setRightSideText] = useState("");

  return (
    <CustomContext.Provider value={{
      selectedColors,
      setSelectedColors,
      leftSideImageCropped,
      setLeftSideImageCropped,
      rightSideImageCropped,
      setRightSideImageCropped,
      isLeftSwooshVisible,
      isRightSwooshVisible,
      setIsLeftSwooshVisible,
      setIsRightSwooshVisible,
      leftSideText,
      setLeftSideText,
      rightSideText,
      setRightSideText,
      setSelectedColorsText,
      selectedColorsText,
      selectedPatches,
      setSelectedPatches
    }}>
      {children}
    </CustomContext.Provider>
  );
};

export { CustomProvider, CustomContext };
