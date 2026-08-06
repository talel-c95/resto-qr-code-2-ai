import mongoose, { Schema, Document } from "mongoose";

export interface TableDocument extends Document {
  number: number;
  restaurantId: string;
  capacity?: number;
  isActive: boolean;
}

const tableSchema = new Schema<TableDocument>(
  {
    number: { type: Number, required: true, unique: true },
    restaurantId: { type: String, default: "r1" },
    capacity: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Table = mongoose.model<TableDocument>("Table", tableSchema);