import mongoose, { Document, Model } from 'mongoose';

export interface DiscountInterface extends Document {
    discountName: string
    discountAmount: number;

}

const discountSchema = new mongoose.Schema({
    discountName: { type: String },
    discountAmount: { type: Number },
});

const Discount: Model<DiscountInterface> = mongoose.model<DiscountInterface>(
  'Discount',
  discountSchema
);

export default Discount;