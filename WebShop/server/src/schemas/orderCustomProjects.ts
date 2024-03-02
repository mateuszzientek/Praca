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

interface ProjectItem {
    selectedColors: {
        selectedColorSwosh_1: { rgb: { r: number; g: number; b: number } };
        selectedColorTip_1: { rgb: { r: number; g: number; b: number } };
        selectedColorHill_1: { rgb: { r: number; g: number; b: number } };
        selectedColorQuarter_1: { rgb: { r: number; g: number; b: number } };
        selectedColorHeel_logo_1: { rgb: { r: number; g: number; b: number } };
        selectedColorToe_1: { rgb: { r: number; g: number; b: number } };
        selectedColorEyestay_1: { rgb: { r: number; g: number; b: number } };
        selectedColorQuarter_2: { rgb: { r: number; g: number; b: number } };
        selectedColorSwosh_2: { rgb: { r: number; g: number; b: number } };
        selectedColorHeel_2: { rgb: { r: number; g: number; b: number } };
        selectedColorEyestay_2: { rgb: { r: number; g: number; b: number } };
    };
    selectedColorsText: {
        selectedColorLeftText: { rgb: { r: number; g: number; b: number } };
        selectedColorRightText: { rgb: { r: number; g: number; b: number } };
    };
    selectedPatches: {
        selectedLeftPatch: string;
        selectedRightPatch: string;
    };
    swooshVisibility: {
        isLeftSwooshVisible: boolean;
        isRightSwooshVisible: boolean;
    };
    sideText: {
        leftText: string;
        rightText: string;
    };
}

const projectItemSchema = new Schema<ProjectItem>({
    selectedColors: Object,
    selectedColorsText: Object,
    selectedPatches: Object,
    swooshVisibility: Object,
    sideText: Object,
});

export interface OrderCustomProjectInterface extends Document {
  orderNumber: string;
  userId?: mongoose.Types.ObjectId;
  project: ProjectItem;
  address: AddressInterface;
  status: string;
  price: number;
  paymentMethod: string;
  deliveryMethod: string;
  orderDate: Date;
}

const orderCustomProjectSchema= new mongoose.Schema<OrderCustomProjectInterface>({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  project: projectItemSchema,
  address: { type: Schema.Types.Mixed, required: true },
  price: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  deliveryMethod: { type: String, required: true },
  orderDate: { type: Date, required: true },
  status: { type: String, required: true },
});

const OrderCustomProject: Model<OrderCustomProjectInterface> = mongoose.model<OrderCustomProjectInterface>(
  "OrderCustomProject",
  orderCustomProjectSchema
);

export default OrderCustomProject;
