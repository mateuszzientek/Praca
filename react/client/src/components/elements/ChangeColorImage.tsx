import React, { useState, useEffect, useRef } from 'react';

function ChangeColorImage(props: any) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [selectedColor, setSelectedColor] = useState('#FF0000'); // Domyślny kolor czerwony

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return; // Sprawdź, czy canvas nie jest null
        const context = canvas.getContext('2d');
        if (!context) return; // Sprawdź, czy context nie jest null

        const img = new Image();

        img.src = props.imageSrc; // Ścieżka do twojego obrazu PNG

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, img.width, img.height);

            // Zmieniamy kolor wybranego elementu
            context.globalCompositeOperation = 'source-in';
            context.fillStyle = selectedColor;
            context.fillRect(0, 0, img.width, img.height);
        };
    }, [selectedColor, props.imageSrc]);

    const handleColorChange = (newColor: any) => {
        setSelectedColor(newColor);
    };

    return (
        <div>
            <canvas ref={canvasRef}></canvas>
            <input type="color" value={selectedColor} onChange={(e) => handleColorChange(e.target.value)} />
        </div>
    );
}

export default ChangeColorImage;