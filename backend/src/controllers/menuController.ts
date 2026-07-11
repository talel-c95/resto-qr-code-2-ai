import { Request, Response, NextFunction } from "express";
import * as menuService from "../services/menuService";

export async function getMenu(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await menuService.getAllMenuItems();
    const formatted = items.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      categoryId: item.categoryId,
      imageUrl: item.imageUrl,
      allergens: item.allergens,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      tags: item.tags,
    }));
    res.status(200).json(formatted);
  } catch (err) {
    next(err);
  }
}