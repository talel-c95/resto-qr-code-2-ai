import mongoose, { Schema, Document } from "mongoose";

export interface MenuItemDocument extends Document {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  tags?: string[];
}

const menuItemSchema = new Schema<MenuItemDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    categoryId: { type: String, required: true },
    imageUrl: { type: String },
    allergens: [{ type: String }],
    isVegetarian: { type: Boolean, default: false },
    isVegan: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const MenuItem = mongoose.model<MenuItemDocument>("MenuItem", menuItemSchema);