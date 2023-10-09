interface Color {
  r: number;
  g: number;
  b: number;
}

function getColorName(currentTextIndex: number) {
  switch (currentTextIndex) {
    case 0:
      return "selectedColorTip_1";
    case 1:
      return "selectedColorQuarter_1";
    case 2:
      return "selectedColorSwosh_1";
    case 3:
      return "selectedColorHill_1";
    case 4:
      return "selectedColorHeel_logo_1";
    case 5:
      return "selectedColorEyestay_1";
    case 6:
      return "selectedColorToe_1";
    case 7:
      return "selectedColorQuarter_2";
    case 8:
      return "selectedColorSwosh_2";
    case 9:
      return "selectedColorHeel_2";
    default:
      return "selectedColorQuarter_1"; // Domyślna nazwa koloru
  }
}


export const handleColorChange = (
  newColor: any,
  currentTextIndex: number,
  selectedColors: any,
  setSelectedColors: any
) => {
  const { r, g, b } = newColor.rgb;
  const updatedColors = { ...selectedColors };

  if (currentTextIndex === 0) {
    updatedColors.selectedColorTip_1 = { rgb: { r, g, b } };
  } else if (currentTextIndex === 1) {
    updatedColors.selectedColorQuarter_1 = { rgb: { r, g, b } };
  } else if (currentTextIndex === 2) {
    updatedColors.selectedColorSwosh_1 = { rgb: { r, g, b } };
  } else if (currentTextIndex === 3) {
    updatedColors.selectedColorHill_1 = { rgb: { r, g, b } };
  } else if (currentTextIndex === 4) {
    updatedColors.selectedColorHeel_logo_1 = { rgb: { r, g, b } };
  } else if (currentTextIndex === 5) {
    updatedColors.selectedColorEyestay_1 = { rgb: { r, g, b } };
  } else if (currentTextIndex === 6) {
    updatedColors.selectedColorToe_1 = { rgb: { r, g, b } };
  } else if (currentTextIndex === 7) {
    updatedColors.selectedColorQuarter_2 = { rgb: { r, g, b } };
  } else if (currentTextIndex === 8) {
    updatedColors.selectedColorSwosh_2 = { rgb: { r, g, b } };
  } else if (currentTextIndex === 9) {
    updatedColors.selectedColorHeel_2 = { rgb: { r, g, b } };
  }

  setSelectedColors(updatedColors);
};

export const handleColorSelection = (
  color: any,
  currentTextIndex: number,
  selectedColors: any,
  setSelectedColors: any
) => {
  const updatedColors = { ...selectedColors };

  if (currentTextIndex === 0) {
    updatedColors.selectedColorTip_1 = { rgb: color };
  } else if (currentTextIndex === 1) {
    updatedColors.selectedColorQuarter_1 = { rgb: color };
  } else if (currentTextIndex === 2) {
    updatedColors.selectedColorSwosh_1 = { rgb: color };
  } else if (currentTextIndex === 3) {
    updatedColors.selectedColorHill_1 = { rgb: color };
  } else if (currentTextIndex === 4) {
    updatedColors.selectedColorHeel_logo_1 = { rgb: color };
  } else if (currentTextIndex === 5) {
    updatedColors.selectedColorEyestay_1 = { rgb: color };
  } else if (currentTextIndex === 6) {
    updatedColors.selectedColorToe_1 = { rgb: color };
  } else if (currentTextIndex === 7) {
    updatedColors.selectedColorQuarter_2 = { rgb: color };
  } else if (currentTextIndex === 8) {
    updatedColors.selectedColorSwosh_2 = { rgb: color };
  } else if (currentTextIndex === 9) {
    updatedColors.selectedColorHeel_2 = { rgb: color };
  }

  setSelectedColors(updatedColors);
};

export const getCurrentColor = (
  currentTextIndex: number,
  selectedColors: any
) => {
  switch (currentTextIndex) {
    case 0:
      return selectedColors.selectedColorTip_1.rgb;
    case 1:
      return selectedColors.selectedColorQuarter_1.rgb;
    case 2:
      return selectedColors.selectedColorSwosh_1.rgb;
    case 3:
      return selectedColors.selectedColorHill_1.rgb;
    case 4:
      return selectedColors.selectedColorHeel_logo_1.rgb;
    case 5:
      return selectedColors.selectedColorEyestay_1.rgb;
    case 6:
      return selectedColors.selectedColorToe_1.rgb;
    case 7:
      return selectedColors.selectedColorQuarter_2.rgb;
    case 8:
      return selectedColors.selectedColorSwosh_2.rgb;
    case 9:
      return selectedColors.selectedColorHeel_2.rgb;
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
  },
  colorToCheck: Color
) {
  switch (currentTextIndex) {
    case 0:
      return (
        selectedColors.selectedColorTip_1.rgb.r === colorToCheck.r &&
        selectedColors.selectedColorTip_1.rgb.g === colorToCheck.g &&
        selectedColors.selectedColorTip_1.rgb.b === colorToCheck.b
      );
    case 1:
      return (
        selectedColors.selectedColorQuarter_1.rgb.r === colorToCheck.r &&
        selectedColors.selectedColorQuarter_1.rgb.g === colorToCheck.g &&
        selectedColors.selectedColorQuarter_1.rgb.b === colorToCheck.b
      );
    case 2:
      return (
        selectedColors.selectedColorSwosh_1.rgb.r === colorToCheck.r &&
        selectedColors.selectedColorSwosh_1.rgb.g === colorToCheck.g &&
        selectedColors.selectedColorSwosh_1.rgb.b === colorToCheck.b
      );
    case 3:
      return (
        selectedColors.selectedColorHill_1.rgb.r === colorToCheck.r &&
        selectedColors.selectedColorHill_1.rgb.g === colorToCheck.g &&
        selectedColors.selectedColorHill_1.rgb.b === colorToCheck.b
      );
    case 4:
      return (
        selectedColors.selectedColorHeel_logo_1.rgb.r === colorToCheck.r &&
        selectedColors.selectedColorHeel_logo_1.rgb.g === colorToCheck.g &&
        selectedColors.selectedColorHeel_logo_1.rgb.b === colorToCheck.b
      );
    case 5:
      return (
        selectedColors.selectedColorEyestay_1.rgb.r === colorToCheck.r &&
        selectedColors.selectedColorEyestay_1.rgb.g === colorToCheck.g &&
        selectedColors.selectedColorEyestay_1.rgb.b === colorToCheck.b
      );
    case 6:
      return (
        selectedColors.selectedColorToe_1.rgb.r === colorToCheck.r &&
        selectedColors.selectedColorToe_1.rgb.g === colorToCheck.g &&
        selectedColors.selectedColorToe_1.rgb.b === colorToCheck.b
      );
    case 7:
      return (
        selectedColors.selectedColorQuarter_2.rgb.r === colorToCheck.r &&
        selectedColors.selectedColorQuarter_2.rgb.g === colorToCheck.g &&
        selectedColors.selectedColorQuarter_2.rgb.b === colorToCheck.b
      );
    case 8:
      return (
        selectedColors.selectedColorSwosh_2.rgb.r === colorToCheck.r &&
        selectedColors.selectedColorSwosh_2.rgb.g === colorToCheck.g &&
        selectedColors.selectedColorSwosh_2.rgb.b === colorToCheck.b
      );
    case 9:
      return (
        selectedColors.selectedColorHeel_2.rgb.r === colorToCheck.r &&
        selectedColors.selectedColorHeel_2.rgb.g === colorToCheck.g &&
        selectedColors.selectedColorHeel_2.rgb.b === colorToCheck.b
      );
    default:
      return false; // Add a default case that returns false
  }
}

export const changeColorToRed = (
  selectedColors: any,
  setSelectedColors: any,
  currentTextIndex: number,
  duration = 500
) => {
  
  const colorName = getColorName(currentTextIndex);

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

export const shouldShowButton = (currentTextIndex: number, selectedColors: any, isColorChanging: boolean) => {
  
  if (isColorChanging) {
    return false;
  }
  if (currentTextIndex === 0 && !isColorWhite(selectedColors.selectedColorTip_1)) {
    return true;
  }
  if (currentTextIndex === 1 && !isColorWhite(selectedColors.selectedColorQuarter_1)) {
    return true;
  }
  if (currentTextIndex === 2 && !isColorWhite(selectedColors.selectedColorSwosh_1)) {
    return true;
  }
  if (currentTextIndex === 3 && !isColorWhite(selectedColors.selectedColorHill_1)) {
    return true;
  }
  if (currentTextIndex === 4 && !isColorWhite(selectedColors.selectedColorHeel_logo_1)) {
    return true;
  }
  if (currentTextIndex === 5 && !isColorWhite(selectedColors.selectedColorEyestay_1)) {
    return true;
  }
  if (currentTextIndex === 6 && !isColorWhite(selectedColors.selectedColorToe_1)) {
    return true;
  }
  if (currentTextIndex === 7 && !isColorWhite(selectedColors.selectedColorQuarter_2)) {
    return true;
  }
  if (currentTextIndex === 8 && !isColorWhite(selectedColors.selectedColorSwosh_2)) {
    return true;
  }
  if (currentTextIndex === 9 && !isColorWhite(selectedColors.selectedColorHeel_2)) {
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
  setSelectedColors: any
) => {
 
  const colorName = getColorName(currentTextIndex);

  if (colorName) {
    changeColorToWhite(selectedColors, setSelectedColors, colorName);
  }
};