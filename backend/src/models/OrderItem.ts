import mongoose, { Schema, Document } from "mongoose";

export interface OrderItemDocument extends Document {
  orderId: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

const orderItemSchema = new Schema<OrderItemDocument>({
  orderId: { type: String, required: true },
  menuItemId: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

export const OrderItem = mongoose.model<OrderItemDocument>("OrderItem", orderItemSchema);