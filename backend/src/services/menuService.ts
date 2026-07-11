import { MenuItem } from "../models/MenuItem";
import { Category } from "../models/Category";

export async function getAllMenuItems() {
  return MenuItem.find();
}

export async function getAllCategories() {
  return Category.find();
}