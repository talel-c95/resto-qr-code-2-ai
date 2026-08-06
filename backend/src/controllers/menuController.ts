import { Request, Response, NextFunction } from "express";
import * as menuService from "../services/menuService";

function formatMenuItem(item: any) {
  return {
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
  };
}

export async function getMenu(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await menuService.getAllMenuItems();
    res.status(200).json(items.map(formatMenuItem));
  } catch (err) {
    next(err);
  }
}

export async function createMenuItem(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await menuService.createMenuItem(req.body);
    res.status(201).json(formatMenuItem(item));
  } catch (err) {
    next(err);
  }
}

export async function updateMenuItem(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await menuService.updateMenuItem(req.params.id, req.body);
    res.status(200).json(formatMenuItem(item));
  } catch (err) {
    next(err);
  }
}

export async function deleteMenuItem(req: Request, res: Response, next: NextFunction) {
  try {
    await menuService.deleteMenuItem(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}