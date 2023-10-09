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
  }) => void;
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
  });

  return (
    <CustomContext.Provider value={{ selectedColors, setSelectedColors }}>
      {children}
    </CustomContext.Provider>
  );
};

export { CustomProvider, CustomContext };
