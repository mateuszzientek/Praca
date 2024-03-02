import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  surname?: string;
  email: string;
  password?: string;
  role: string;
  newsletter?: boolean;
  email_offert?: boolean;
  resetToken?: string;
  resetTokenExpiration?: Date;
  dateOfBirth?: Date;
  gender?: string;
  avatar?: string
  isGoogle: boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  surname: { type: String },
  email: { type: String, required: true },
  password: { type: String },
  role: { type: String, required: true },
  newsletter: { type: Boolean },
  email_offert: { type: Boolean, default: false },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
  dateOfBirth: { type: Date },
  gender: { type: String },
  avatar: { type: String },
  isGoogle: { type: Boolean, default: true },
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
