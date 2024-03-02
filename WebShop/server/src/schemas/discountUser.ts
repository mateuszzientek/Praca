import mongoose, { Document, Model } from 'mongoose';

export interface DiscountUserInterface extends Document {
    userId?: mongoose.Types.ObjectId;
    discountId: mongoose.Types.ObjectId
    sessionId?: string;
    expireDate?: Date

}

const discountUserSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    discountId: { type: mongoose.Schema.Types.ObjectId, ref: "Discount" },
    sessionId: { type: String },
    expireDate: { type: Date },
});

const DiscountUser: Model<DiscountUserInterface> = mongoose.model<DiscountUserInterface>(
  'DiscountUser',
  discountUserSchema
);

export default DiscountUser;