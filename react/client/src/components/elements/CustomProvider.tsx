import React, { createContext, useState, ReactNode, useEffect } from "react";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import storage from "../../resources/firebase";

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
  sideText: {
    leftText: string;
    rightText: string;
  };
  swooshVisibility: {
    isLeftSwooshVisible: boolean,
    isRightSwooshVisible: boolean,
  };
  imagesUrls: {
    leftSideImageCroppedUrl: string,
    rightSideImageCroppedUrl: string,
  };
  setImagesUrls: (url: { leftSideImageCroppedUrl: string; rightSideImageCroppedUrl: string }) => void;
  setSwooshVisibility: (visibility: { isLeftSwooshVisible: boolean; isRightSwooshVisible: boolean }) => void;
  setSideText: (text: { leftText: string; rightText: string }) => void;
  leftSideImageCropped: File | null;
  rightSideImageCropped: File | null;
  setLeftSideImageCropped: (image: File | null) => void;
  setRightSideImageCropped: (image: File | null) => void;
  photos: string[]; // Dodaj photos
  patches: Array<{ url: string; name: string }> // Dodaj patches
  isPhotos_Patches: boolean
  initialValuesLoaded: boolean
}
interface CustomContextProviderChildren {
  children: ReactNode;
}

const CustomContext = createContext<CustomContextProps>(
  {} as CustomContextProps
);

const CustomProvider: React.FC<CustomContextProviderChildren> = ({
  children,
}) => {

  const [isPhotos_Patches, setIsPhotos_Patches] = useState(false);
  const [initialValuesLoaded, setInitialValuesLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const folderRef = ref(storage, `shoeType/low`);
        const res = await listAll(folderRef);
        const urls: string[] = [];

        for (const itemRef of res.items) {
          try {
            const url = await getDownloadURL(itemRef);
            urls.push(url);
          } catch (error) {
            console.log(error);
          }
        }
        setPhotos(urls);

        const folderPatchesRef = ref(storage, `patches`);
        const resPatches = await listAll(folderPatchesRef);
        const patchInfoArray = [];

        for (const itemRef of resPatches.items) {
          try {
            const url = await getDownloadURL(itemRef);
            const name = itemRef.name;
            const patchInfo = { url, name };
            patchInfoArray.push(patchInfo);
          } catch (error) {
            console.log(error);
          }
        }
        setInitialValuesLoaded(true)
        setPatches(patchInfoArray);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    setIsPhotos_Patches(true)
  }, []);

  const [photos, setPhotos] = useState<string[]>([]);
  const [patches, setPatches] = useState<Array<{ url: string; name: string }>>([]);
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
  const [swooshVisibility, setSwooshVisibility] = useState({
    isLeftSwooshVisible: true,
    isRightSwooshVisible: true,
  });
  const [sideText, setSideText] = useState<{ leftText: string; rightText: string }>({ leftText: "", rightText: "" });
  const [imagesUrls, setImagesUrls] = useState({
    leftSideImageCroppedUrl: "",
    rightSideImageCroppedUrl: "",
  });

  return (
    <CustomContext.Provider value={{
      selectedColors,
      setSelectedColors,
      leftSideImageCropped,
      setLeftSideImageCropped,
      rightSideImageCropped,
      setRightSideImageCropped,
      setSwooshVisibility,
      swooshVisibility,
      setSelectedColorsText,
      selectedColorsText,
      selectedPatches,
      setSelectedPatches,
      setSideText,
      sideText,
      imagesUrls,
      setImagesUrls,
      photos,
      patches,
      isPhotos_Patches,
      initialValuesLoaded
    }}>
      {children}
    </CustomContext.Provider>
  );
};

export { CustomProvider, CustomContext };
