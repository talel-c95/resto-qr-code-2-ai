import mongoose, { Schema, Document } from "mongoose";

export interface ReceiptDocument extends Document {
  orderId: string;
  generatedAt: Date;
}

const receiptSchema = new Schema<ReceiptDocument>({
  orderId: { type: String, required: true, unique: true },
  generatedAt: { type: Date, default: Date.now },
});

export const Receipt = mongoose.model<ReceiptDocument>("Receipt", receiptSchema);