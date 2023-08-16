import mongoose, { Document, Model } from "mongoose";


export interface CartInterface extends Document {
  userId?: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId
  sessionId?: string | null
  expireDate?: Date | null
  size: string,
  quantity: number
}

const cartSchema = new mongoose.Schema<CartInterface>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sessionId: { type: String },
  expireDate: { type: Date },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const Cart: Model<CartInterface> = mongoose.model<CartInterface>("Cart", cartSchema);

export default Cart;