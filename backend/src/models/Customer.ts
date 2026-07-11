import mongoose, { Schema, Document } from "mongoose";

export interface CustomerDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: "customer";
  createdAt: Date;
}

const customerSchema = new Schema<CustomerDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: "customer" },
  },
  { timestamps: true }
);

export const Customer = mongoose.model<CustomerDocument>("Customer", customerSchema);