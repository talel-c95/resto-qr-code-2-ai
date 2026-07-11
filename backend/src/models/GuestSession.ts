import mongoose, { Schema, Document } from "mongoose";

export interface GuestSessionDocument extends Document {
  tableId: string;
  createdAt: Date;
}

const guestSessionSchema = new Schema<GuestSessionDocument>(
  {
    tableId: { type: String, required: true },
  },
  { timestamps: true }
);

export const GuestSession = mongoose.model<GuestSessionDocument>(
  "GuestSession",
  guestSessionSchema
);