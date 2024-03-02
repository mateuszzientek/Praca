import mongoose, { Document, Model, Schema } from 'mongoose';

export interface DesignProjectInterface extends Document {
    userId: mongoose.Types.ObjectId;
    projects: ProjectItem[];
}

interface ProjectItem {
    _id? : string,
    designName: string,
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
    designName: String,
    selectedColors: Object,
    selectedColorsText: Object,
    selectedPatches: Object,
    swooshVisibility: Object,
    sideText: Object,
});

const designProjectSchema = new Schema<DesignProjectInterface>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    projects: [projectItemSchema],
});

const DesignProject: Model<DesignProjectInterface> = mongoose.model<DesignProjectInterface>(
    'DesignProject',
    designProjectSchema
);

export default DesignProject;