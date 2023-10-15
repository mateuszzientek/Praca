import React from 'react';
import "react-image-crop/dist/ReactCrop.css";
import Cropper from "react-easy-crop";

interface GraphicsCropDivProps {
    image: string | null;
    crop: { x: number, y: number };
    zoom: number;
    setZoom: React.Dispatch<React.SetStateAction<number>>;
    setCrop: React.Dispatch<React.SetStateAction<{ x: number, y: number }>>;
    setImage: (image: string | null) => void;
    handleZoomChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onCropComplete: (croppedAreaPercentage: any, croppedAreaPixels: any) => void;
    submit: () => void
}

function GraphicsCropDiv(props: GraphicsCropDivProps) {

    const buttonStyle = "border-2 border-black/80  rounded-full px-10 py-3 hover:bg-black/80 hover:text-white dark:border-white hover:dark:bg-[#363636]"

    return (
        <div className='bg-black/50 backdrop-blur-sm fixed w-full h-screen z-20 flex justify-center items-center '>
            <div className="flex flex-col items-center justify-center bg-white dark:bg-[#757575] rounded-lg w-[60%] h-[70%] text-center py-10">
                <p className="text-3xl text-black/80 dark:text-white/80">
                    Przytnij zdjecie
                </p>

                <div className="relative h-[80%] w-[80%] mt-4 ">
                    <Cropper
                        image={props.image || ""}
                        crop={props.crop}
                        zoom={props.zoom}
                        aspect={5 / 3}  // Ustaw stosunek szerokości do wysokości na 16:9 (poziomy)
                        onZoomChange={props.setZoom}
                        onCropChange={props.setCrop}
                        onCropComplete={props.onCropComplete}
                    />
                </div>

                <input className="w-full lg:w-[60%] mt-6" type="range" value={props.zoom} step={0.01} onChange={props.handleZoomChange} min={1} max={3} />

                <div className="flex items-center mt-4 space-x-6">
                    <button onClick={() => props.setImage("")}
                        className={buttonStyle}>
                        <p className="text-lg text-black/80 dark:text-white">Powrót</p>
                    </button>

                    <button onClick={() => props.submit()} className={buttonStyle}>
                        <p className="text-lg text-black/80 dark:text-white">Zapisz</p>
                    </button>
                </div>

            </div>
        </div>
    );
}

export default GraphicsCropDiv;