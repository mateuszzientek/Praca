import React from 'react';
import "react-image-crop/dist/ReactCrop.css";
import Cropper from "react-easy-crop";
import { useTranslation } from "react-i18next";

interface GraphicsCropDivProps {
    image: string | null;
    crop: { x: number, y: number };
    zoom: number;
    setZoom: React.Dispatch<React.SetStateAction<number>>;
    setCrop: React.Dispatch<React.SetStateAction<{ x: number, y: number }>>;
    setImage: (image: string | null) => void;
    handleZoomChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onCropComplete: (croppedAreaPercentage: any, croppedAreaPixels: any) => void;
    submit: () => void;
}

function GraphicsCropDiv(props: GraphicsCropDivProps) {
    const { t } = useTranslation();
    const buttonStyle = "border-2 border-black/80  rounded-full px-10 py-3 hover:bg-black/80 hover:text-white dark:border-white hover:dark:bg-[#363636]"

    return (
        <div className='bg-black/50 backdrop-blur-sm fixed w-full h-screen z-20 flex justify-center items-center'>
            <div className="flex flex-col items-center justify-center bg-white dark:bg-[#757575] rounded-lg w-full xl:w-[80rem] h-[80%] text-center py-10">
                <div style={{ overflowY: "auto", height: "100%" }} >
                    <p className="text-3xl text-black/80 dark:text-white/80">
                        {t("designSection.text23")}
                    </p>

                    <div className="relative h-[80%] w-[25rem] md:w-[40rem] xl:w-[60rem] mt-4 ">
                        <Cropper
                            image={props.image || ""}
                            crop={props.crop}
                            zoom={props.zoom}
                            aspect={5 / 3}
                            onZoomChange={props.setZoom}
                            onCropChange={props.setCrop}
                            onCropComplete={props.onCropComplete}
                        />
                    </div>

                    <input className="w-full 2xl:w-[60%] mt-6" type="range" value={props.zoom} step={0.01} onChange={props.handleZoomChange} min={1} max={3} />
                </div>

                <div className="flex items-center mt-4 space-x-6">
                    <button onClick={() => props.setImage("")}
                        className={buttonStyle}>
                        <p className="text-lg text-black/80 dark:text-white">{t("designSection.text1")}</p>
                    </button>

                    <button onClick={() => props.submit()} className={buttonStyle}>
                        <p className="text-lg text-black/80 dark:text-white">{t("designSection.text2")}</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GraphicsCropDiv;
