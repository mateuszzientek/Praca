import mongoose, { Document, Model } from "mongoose";

export interface ShoesInterface extends Document {
  name: string;
  category: string,
  price: number
  discountPrice: number,
  image: string
}

const shoesSchema = new mongoose.Schema<ShoesInterface>({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    image: { type: String, required: true },
  });

  const Shoes: Model<ShoesInterface> = mongoose.model<ShoesInterface>("Shoes", shoesSchema);

  export default Shoes;
  