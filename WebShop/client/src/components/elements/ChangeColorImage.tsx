import React, { useState, useEffect, useRef } from 'react';

function ChangeColorImage(props: any) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [selectedColor, setSelectedColor] = useState('#FF0000');

    const handleColorChange = (newColor: any) => {
        setSelectedColor(newColor);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        const img = new Image();

        img.src = props.imageSrc;

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

    return (
        <div>
            <canvas ref={canvasRef}></canvas>
            <input type="color" value={selectedColor} onChange={(e) => handleColorChange(e.target.value)} />
        </div>
    );
}

export default ChangeColorImage;