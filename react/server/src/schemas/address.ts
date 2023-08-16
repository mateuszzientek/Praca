import mongoose, { Document, Model } from "mongoose";

export interface AddressInterface extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  surname: string;
  street: string;
  city: string;
  postalCode: string;
  telephone: string;
  extra?: string;
  isDefault: boolean;
  country: string
}

const addressSchema = new mongoose.Schema<AddressInterface>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  telephone: { type: String, required: true },
  extra: { type: String },
  isDefault: { type: Boolean, default: false },
  country: { type: String, required: true },
});

const Address: Model<AddressInterface> = mongoose.model<AddressInterface>(
  "Address",
  addressSchema
);

export default Address;
