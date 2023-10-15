import React from "react";
import { Image, Transformation } from "cloudinary-react";

interface TransformedImageProps {
  publicId: string;
  rgb: { r: number; g: number; b: number };
  opacity: string
}

function TransformedImage(props: TransformedImageProps) {
  return (
    <Image
      publicId={props.publicId}
      className={`absolute top-0 left-0 ${props.opacity}`}
    >
      <Transformation
        effect={"red:" + ((-1 + props.rgb.r / 255) * 100).toFixed(0)}
      />
      <Transformation
        effect={"blue:" + ((-1 + props.rgb.b / 255) * 100).toFixed(0)}
      />
      <Transformation
        effect={"green:" + ((-1 + props.rgb.g / 255) * 100).toFixed(0)}
      />
    </Image>
  );
}

export default TransformedImage;
