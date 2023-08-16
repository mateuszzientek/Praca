import mongoose, { Document, Model, Schema } from "mongoose";

interface AddressInterface {
  email: string;
  name: string;
  surname: string;
  street: string;
  city: string;
  postalCode: string;
  telephone: string;
  extra?: string;
  country: string;
}

interface ProductInterface {
  shoeId: mongoose.Types.ObjectId;
  size: string;
  quantity: number;
}

export interface OrderInterface extends Document {
  orderNumber: string;
  userId?: mongoose.Types.ObjectId;
  status: string;
  address: AddressInterface;
  products: ProductInterface[];
  price: number;
  paymentMethod: string;
  deliveryMethod: string;
  discount: number | null
  orderDate: Date;
}

const orderSchema = new mongoose.Schema<OrderInterface>({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  address: { type: Schema.Types.Mixed, required: true },
  products: [{ shoeId: String, size: String, quantity: Number }],
  price: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  deliveryMethod: { type: String, required: true },
  orderDate: { type: Date, required: true },
  status: { type: String, required: true },
  discount: { type: Number},
});

const Order: Model<OrderInterface> = mongoose.model<OrderInterface>(
  "Order",
  orderSchema
);

export default Order;
