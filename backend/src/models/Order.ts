import mongoose, { Schema, Document } from "mongoose";

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "served"
  | "completed"
  | "cancelled";

export interface OrderDocument extends Document {
  tableId: string;
  customerId?: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
}

const orderSchema = new Schema<OrderDocument>(
  {
    tableId: { type: String, required: true },
    customerId: { type: String },
    status: {
      type: String,
      enum: ["pending", "accepted", "preparing", "ready", "served", "completed", "cancelled"],
      default: "pending",
    },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Order = mongoose.model<OrderDocument>("Order", orderSchema);