interface Color {
  r: number;
  g: number;
  b: number;
}

function getColorName(currentTextIndex: number, textArray: string[]) {
  if (textArray[currentTextIndex] === "tip_1") {
    return "selectedColorTip_1";
  } else if (textArray[currentTextIndex] === "quarter_1") {
    return "selectedColorQuarter_1";
  } else if (textArray[currentTextIndex] === "swoosh_1") {
    return "selectedColorSwosh_1";
  } else if (textArray[currentTextIndex] === "heel_1") {
    return "selectedColorHill_1";
  } else if (textArray[currentTextIndex] === "heel_logo") {
    return "selectedColorHeel_logo_1";
  } else if (textArray[currentTextIndex] === "eyestay_1") {
    return "selectedColorEyestay_1";
  } else if (textArray[currentTextIndex] === "toe") {
    return "selectedColorToe_1";
  } else if (textArray[currentTextIndex] === "quarter_2") {
    return "selectedColorQuarter_2";
  } else if (textArray[currentTextIndex] === "swoosh_2") {
    return "selectedColorSwosh_2";
  } else if (textArray[currentTextIndex] === "heel_2") {
    return "selectedColorHeel_2";
  } else if (textArray[currentTextIndex] === "eyestay_2") {
    return "selectedColorEyestay_2";
  } else {
    return ""; 
  }
}

export const handleColorChange = (
  newColor: any,
  currentTextIndex: number,
  selectedColors: any,
  setSelectedColors: any,
  textArray: string[]
) => {
  const { r, g, b } = newColor.rgb;
  const updatedColors = { ...selectedColors };

  if (textArray[currentTextIndex] === "tip_1") {
    updatedColors.selectedColorTip_1 = { rgb: { r, g, b } };
  } else if (textArray[currentTextIndex] === "quarter_1") {
    updatedColors.selectedColorQuarter_1 = { rgb: { r, g, b } };
  } else if (textArray[currentTextIndex] === "swoosh_1") {
    updatedColors.selectedColorSwosh_1 = { rgb: { r, g, b } };
  } else if (textArray[currentTextIndex] === "heel_1") {
    updatedColors.selectedColorHill_1 = { rgb: { r, g, b } };
  } else if (textArray[currentTextIndex] === "heel_logo") {
    updatedColors.selectedColorHeel_logo_1 = { rgb: { r, g, b } };
  } else if (textArray[currentTextIndex] === "eyestay_1") {
    updatedColors.selectedColorEyestay_1 = { rgb: { r, g, b } };
  } else if (textArray[currentTextIndex] === "toe") {
    updatedColors.selectedColorToe_1 = { rgb: { r, g, b } };
  } else if (textArray[currentTextIndex] === "quarter_2") {
    updatedColors.selectedColorQuarter_2 = { rgb: { r, g, b } };
  } else if (textArray[currentTextIndex] === "swoosh_2") {
    updatedColors.selectedColorSwosh_2 = { rgb: { r, g, b } };
  } else if (textArray[currentTextIndex] === "heel_2") {
    updatedColors.selectedColorHeel_2 = { rgb: { r, g, b } };
  } else if (textArray[currentTextIndex] === "eyestay_2") {
    updatedColors.selectedColorEyestay_2 = { rgb: { r, g, b } };
  }

  setSelectedColors(updatedColors);
};

export const handleColorSelection = (
  color: any,
  currentTextIndex: number,
  selectedColors: any,
  setSelectedColors: any,
  textArray: string[]
) => {
  const updatedColors = { ...selectedColors };

  if (textArray[currentTextIndex] === "tip_1") {
    updatedColors.selectedColorTip_1 =  { rgb: color };
  } else if (textArray[currentTextIndex] === "quarter_1") {
    updatedColors.selectedColorQuarter_1 =  { rgb: color };
  } else if (textArray[currentTextIndex] === "swoosh_1") {
    updatedColors.selectedColorSwosh_1 =  { rgb: color };
  } else if (textArray[currentTextIndex] === "heel_1") {
    updatedColors.selectedColorHill_1 =  { rgb: color };
  } else if (textArray[currentTextIndex] === "heel_logo") {
    updatedColors.selectedColorHeel_logo_1 =  { rgb: color };
  } else if (textArray[currentTextIndex] === "eyestay_1") {
    updatedColors.selectedColorEyestay_1 =  { rgb: color };
  } else if (textArray[currentTextIndex] === "toe") {
    updatedColors.selectedColorToe_1 =  { rgb: color };
  } else if (textArray[currentTextIndex] === "quarter_2") {
    updatedColors.selectedColorQuarter_2 =  { rgb: color };
  } else if (textArray[currentTextIndex] === "swoosh_2") {
    updatedColors.selectedColorSwosh_2 =  { rgb: color };
  } else if (textArray[currentTextIndex] === "heel_2") {
    updatedColors.selectedColorHeel_2 =  { rgb: color };
  }else if (textArray[currentTextIndex] === "eyestay_2") {
    updatedColors.selectedColorEyestay_2 =  { rgb: color };
  }

  setSelectedColors(updatedColors);
};

export const getCurrentColor = (
  currentTextIndex: number,
  selectedColors: any,
  textArray: string []
) => {
  if (textArray[currentTextIndex] === "tip_1") {
    return selectedColors.selectedColorTip_1.rgb
  } else if (textArray[currentTextIndex] === "quarter_1") {
    return selectedColors.selectedColorQuarter_1.rgb
  } else if (textArray[currentTextIndex] === "swoosh_1") {
    return selectedColors.selectedColorSwosh_1.rgb
  } else if (textArray[currentTextIndex] === "heel_1") {
    return selectedColors.selectedColorHill_1.rgb
  } else if (textArray[currentTextIndex] === "heel_logo") {
    return selectedColors.selectedColorHeel_logo_1.rgb
  } else if (textArray[currentTextIndex] === "eyestay_1") {
    return selectedColors.selectedColorEyestay_1.rgb
  } else if (textArray[currentTextIndex] === "toe") {
    return selectedColors.selectedColorToe_1.rgb
  } else if (textArray[currentTextIndex] === "quarter_2") {
    return selectedColors.selectedColorQuarter_2.rgb
  } else if (textArray[currentTextIndex] === "swoosh_2") {
    return selectedColors.selectedColorSwosh_2.rgb
  } else if (textArray[currentTextIndex] === "heel_2") {
    return selectedColors.selectedColorHeel_2.rgb
  } else if (textArray[currentTextIndex] === "eyestay_2") {
    return selectedColors.selectedColorEyestay_2.rgb
  }

};

export function isColorSelected(
  currentTextIndex: number,
  selectedColors: {
    selectedColorTip_1: { rgb: Color };
    selectedColorQuarter_1: { rgb: Color };
    selectedColorSwosh_1: { rgb: Color };
    selectedColorHill_1: { rgb: Color };
    selectedColorHeel_logo_1: { rgb: Color };
    selectedColorToe_1: { rgb: Color };
    selectedColorEyestay_1: { rgb: Color };
    selectedColorQuarter_2: { rgb: Color };
    selectedColorSwosh_2: { rgb: Color };
    selectedColorHeel_2: { rgb: Color };
    selectedColorEyestay_2: { rgb: Color };
  },
  colorToCheck: Color,
  textArray: string[]
) {

  if (textArray[currentTextIndex] === "tip_1") {
    return (
      selectedColors.selectedColorTip_1.rgb.r === colorToCheck.r &&
      selectedColors.selectedColorTip_1.rgb.g === colorToCheck.g &&
      selectedColors.selectedColorTip_1.rgb.b === colorToCheck.b
    );
  } else if (textArray[currentTextIndex] === "quarter_1") {
    return (
      selectedColors.selectedColorQuarter_1.rgb.r === colorToCheck.r &&
      selectedColors.selectedColorQuarter_1.rgb.g === colorToCheck.g &&
      selectedColors.selectedColorQuarter_1.rgb.b === colorToCheck.b
    );
  } else if (textArray[currentTextIndex] === "swoosh_1") {
    return (
      selectedColors.selectedColorSwosh_1.rgb.r === colorToCheck.r &&
      selectedColors.selectedColorSwosh_1.rgb.g === colorToCheck.g &&
      selectedColors.selectedColorSwosh_1.rgb.b === colorToCheck.b
    );
  } else if (textArray[currentTextIndex] === "heel_1") {
    return (
      selectedColors.selectedColorHill_1.rgb.r === colorToCheck.r &&
      selectedColors.selectedColorHill_1.rgb.g === colorToCheck.g &&
      selectedColors.selectedColorHill_1.rgb.b === colorToCheck.b
    );
  } else if (textArray[currentTextIndex] === "heel_logo") {
    return (
      selectedColors.selectedColorHeel_logo_1.rgb.r === colorToCheck.r &&
      selectedColors.selectedColorHeel_logo_1.rgb.g === colorToCheck.g &&
      selectedColors.selectedColorHeel_logo_1.rgb.b === colorToCheck.b
    );
  } else if (textArray[currentTextIndex] === "eyestay_1") {
    return (
      selectedColors.selectedColorEyestay_1.rgb.r === colorToCheck.r &&
      selectedColors.selectedColorEyestay_1.rgb.g === colorToCheck.g &&
      selectedColors.selectedColorEyestay_1.rgb.b === colorToCheck.b
    );
  } else if (textArray[currentTextIndex] === "toe") {
    return (
      selectedColors.selectedColorToe_1.rgb.r === colorToCheck.r &&
      selectedColors.selectedColorToe_1.rgb.g === colorToCheck.g &&
      selectedColors.selectedColorToe_1.rgb.b === colorToCheck.b
    );
  } else if (textArray[currentTextIndex] === "quarter_2") {
    return (
      selectedColors.selectedColorQuarter_2.rgb.r === colorToCheck.r &&
      selectedColors.selectedColorQuarter_2.rgb.g === colorToCheck.g &&
      selectedColors.selectedColorQuarter_2.rgb.b === colorToCheck.b
    );
  } else if (textArray[currentTextIndex] === "swoosh_2") {
    return (
      selectedColors.selectedColorSwosh_2.rgb.r === colorToCheck.r &&
      selectedColors.selectedColorSwosh_2.rgb.g === colorToCheck.g &&
      selectedColors.selectedColorSwosh_2.rgb.b === colorToCheck.b
    );
  } else if (textArray[currentTextIndex] === "eyestay_2") {
      return (
        selectedColors.selectedColorEyestay_2.rgb.r === colorToCheck.r &&
      selectedColors.selectedColorEyestay_2.rgb.g === colorToCheck.g &&
      selectedColors.selectedColorEyestay_2.rgb.b === colorToCheck.b
      );
  } else if (textArray[currentTextIndex] === "heel_2") {
    return (
      selectedColors.selectedColorHeel_2.rgb.r === colorToCheck.r &&
      selectedColors.selectedColorHeel_2.rgb.g === colorToCheck.g &&
      selectedColors.selectedColorHeel_2.rgb.b === colorToCheck.b
    );
  }else{
    return false
  }
}

export const changeColorToRed = (
  selectedColors: any,
  setSelectedColors: any,
  currentTextIndex: number,
  textArray: string[]
) => {

  const duration=500
  
  const colorName = getColorName(currentTextIndex, textArray);

  // Sprawdzamy, czy początkowy kolor jest biały
  if (
    selectedColors[colorName].rgb.r === 255 &&
    selectedColors[colorName].rgb.g === 255 &&
    selectedColors[colorName].rgb.b === 255
  ) {
    const updatedSelectedColors = { ...selectedColors };
    updatedSelectedColors[colorName] = {
      rgb: { r: 255, g: 143, b: 135 },
    }; // Czerwony kolor
    setSelectedColors(updatedSelectedColors);

    setTimeout(() => {
      const updatedSelectedColorsBackToWhite = { ...updatedSelectedColors };
      updatedSelectedColorsBackToWhite[colorName] = {
        rgb: { r: 255, g: 255, b: 255 },
      }; 
      setSelectedColors(updatedSelectedColorsBackToWhite);
    }, duration);
  }
};

export const isColorWhite = (color: any) => {
  return color.rgb.r === 255 && color.rgb.g === 255 && color.rgb.b === 255;
};

export const shouldShowButton = (currentTextIndex: number, selectedColors: any, isColorChanging: boolean, textArray: string[]) => {
  
  if (isColorChanging) {
    return false;
  }
  if (textArray[currentTextIndex] === "tip_1" && !isColorWhite(selectedColors.selectedColorTip_1)) {
    return true;
  }
  if (textArray[currentTextIndex] === "quarter_1" && !isColorWhite(selectedColors.selectedColorQuarter_1)) {
    return true;
  }
  if (textArray[currentTextIndex] === "swoosh_1" && !isColorWhite(selectedColors.selectedColorSwosh_1)) {
    return true;
  }
  if (textArray[currentTextIndex] === "heel_1" && !isColorWhite(selectedColors.selectedColorHill_1)) {
    return true;
  }
  if (textArray[currentTextIndex] === "heel_logo" && !isColorWhite(selectedColors.selectedColorHeel_logo_1)) {
    return true;
  }
  if (textArray[currentTextIndex] === "eyestay_1" && !isColorWhite(selectedColors.selectedColorEyestay_1)) {
    return true;
  }
  if (textArray[currentTextIndex] === "eyestay_2" && !isColorWhite(selectedColors.selectedColorEyestay_2)) {
    return true;
  }
  if (textArray[currentTextIndex] === "toe" && !isColorWhite(selectedColors.selectedColorToe_1)) {
    return true;
  }
  if (textArray[currentTextIndex] === "quarter_2" && !isColorWhite(selectedColors.selectedColorQuarter_2)) {
    return true;
  }
  if (textArray[currentTextIndex] === "swoosh_2" && !isColorWhite(selectedColors.selectedColorSwosh_2)) {
    return true;
  }
  if (textArray[currentTextIndex] === "heel_2" && !isColorWhite(selectedColors.selectedColorHeel_2)) {
    return true;
  }

  return false; 
};

export const changeColorToWhite = (
  selectedColors: any,
  setSelectedColors: any,
  colorName: string
) => {
  const updatedSelectedColors = { ...selectedColors };
  updatedSelectedColors[colorName] = { rgb: { r: 255, g: 255, b: 255 } };
  setSelectedColors(updatedSelectedColors);
};


export const handleDeleteColor = (
  currentTextIndex: number,
  selectedColors: any,
  setSelectedColors: any,
  textArray: string[]
) => {
 
  const colorName = getColorName(currentTextIndex, textArray);

  if (colorName) {
    changeColorToWhite(selectedColors, setSelectedColors, colorName);
  }
};