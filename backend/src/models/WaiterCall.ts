import mongoose, { Schema, Document } from "mongoose";

export interface WaiterCallDocument extends Document {
  tableId: string;
  status: "pending" | "resolved";
  createdAt: Date;
}

const waiterCallSchema = new Schema<WaiterCallDocument>(
  {
    tableId: { type: String, required: true },
    status: { type: String, enum: ["pending", "resolved"], default: "pending" },
  },
  { timestamps: true }
);

export const WaiterCall = mongoose.model<WaiterCallDocument>("WaiterCall", waiterCallSchema);