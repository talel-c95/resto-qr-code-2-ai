import mongoose, { Schema, Document } from "mongoose";

export interface AdminDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin";
  createdAt: Date;
}

const adminSchema = new Schema<AdminDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

export const Admin = mongoose.model<AdminDocument>("Admin", adminSchema);