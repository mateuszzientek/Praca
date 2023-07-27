import mongoose, { Document, Model } from "mongoose";

export interface CartInterface extends Document {
    userId?: mongoose.Types.ObjectId;
    sessionId?: string;
    productId: mongoose.Types.ObjectId;
    quantity: number;
    size: string;
  }


const cartSchema = new mongoose.Schema<CartInterface >({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Dodane pole userId
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  sessionId: { type: String}, 
  quantity: { type: Number, required: true },
  size: { type: String, required: true },
});


const Cart: Model<CartInterface> = mongoose.model<CartInterface>("Cart", cartSchema);

export default Cart;