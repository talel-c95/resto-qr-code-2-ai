import mongoose, { Schema, Document } from "mongoose";

export interface CategoryDocument extends Document {
  name: string;
  restaurantId: string;
}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true },
    restaurantId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Category = mongoose.model<CategoryDocument>("Category", categorySchema);