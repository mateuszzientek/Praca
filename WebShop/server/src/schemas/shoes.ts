import mongoose, { Document, Model } from "mongoose";

export interface Size {
  size: string;
  quantity: number;
}

export interface ShoesInterface extends Document {
  name: string;
  category: string,
  brand: string,
  price: number
  discountPrice: number,
  image: string
  sizes: Size[];
}

const shoesSchema = new mongoose.Schema<ShoesInterface>({
    name: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    image: { type: String, required: true },
    sizes: [{ size: String, quantity: Number }],
  });

  const Shoes: Model<ShoesInterface> = mongoose.model<ShoesInterface>("Shoes", shoesSchema);

  export default Shoes;
  