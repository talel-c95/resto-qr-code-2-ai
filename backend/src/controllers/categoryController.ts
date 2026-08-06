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

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await menuService.createCategory(req.body);
    res.status(201).json({
      id: category._id.toString(),
      name: category.name,
      restaurantId: category.restaurantId,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await menuService.updateCategory(req.params.id, req.body);
    res.status(200).json({
      id: category._id.toString(),
      name: category.name,
      restaurantId: category.restaurantId,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    await menuService.deleteCategory(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}