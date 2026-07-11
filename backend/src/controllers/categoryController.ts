import { Request, Response, NextFunction } from "express";
import * as menuService from "../services/menuService";

export async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await menuService.getAllCategories();
    const formatted = categories.map((cat) => ({
      id: cat._id.toString(),
      name: cat.name,
      restaurantId: cat.restaurantId,
    }));
    res.status(200).json(formatted);
  } catch (err) {
    next(err);
  }
}