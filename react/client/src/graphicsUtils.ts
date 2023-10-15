export const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>, setImage: (result: string | null) => void) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.addEventListener("load", () => {
        const result = reader.result as string | null;
        setImage(result);
      });
    }
  };

  export async function getCroppedImageFile(
    imageSrc: string,
    croppedAreaPixels: any
  ): Promise<File> {
    const img = new Image();
    img.src = imageSrc;
  
    const canvas = document.createElement("canvas");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
  
    const ctx = canvas.getContext("2d");
  
    if (ctx) {
      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
  
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "cropped-image.jpg", {
              type: "image/jpeg",
            });
            resolve(file);
          }
        }, "image/jpeg");
      });
    } else {
      throw new Error("Canvas context is null");
    }
  }