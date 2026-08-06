import { MenuItem } from "../models/MenuItem";
import { Category } from "../models/Category";
import { AppError } from "../utils/errors";

export async function getAllMenuItems() {
  return MenuItem.find();
}

export async function getAllCategories() {
  return Category.find();
}


export async function createCategory(data: { name: string; restaurantId?: string }) {
  if (!data.name) {
    throw new AppError("Category name is required", 400);
  }
  return Category.create({
    name: data.name,
    restaurantId: data.restaurantId || "r1",
  });
}

export async function updateCategory(id: string, data: { name?: string; restaurantId?: string }) {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  if (data.name !== undefined) category.name = data.name;
  if (data.restaurantId !== undefined) category.restaurantId = data.restaurantId;
  await category.save();
  return category;
}

export async function deleteCategory(id: string) {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  const itemsInCategory = await MenuItem.countDocuments({ categoryId: id });
  if (itemsInCategory > 0) {
    throw new AppError("Cannot delete a category that still has menu items", 409);
  }
  await category.deleteOne();
}

export async function createMenuItem(data: {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  tags?: string[];
}) {
  if (!data.name || !data.description || data.price === undefined || !data.categoryId) {
    throw new AppError("name, description, price, and categoryId are required", 400);
  }
  const category = await Category.findById(data.categoryId);
  if (!category) {
    throw new AppError("categoryId does not reference an existing category", 400);
  }
  return MenuItem.create(data);
}

export async function updateMenuItem(id: string, data: Partial<{
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  allergens: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  tags: string[];
}>) {
  const item = await MenuItem.findById(id);
  if (!item) {
    throw new AppError("Menu item not found", 404);
  }
  if (data.categoryId) {
    const category = await Category.findById(data.categoryId);
    if (!category) {
      throw new AppError("categoryId does not reference an existing category", 400);
    }
  }
  Object.assign(item, data);
  await item.save();
  return item;
}

export async function deleteMenuItem(id: string) {
  const item = await MenuItem.findById(id);
  if (!item) {
    throw new AppError("Menu item not found", 404);
  }
  await item.deleteOne();
}