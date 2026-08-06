
import { Response, NextFunction } from "express";
import * as aiService from "../services/aiService";
import { AuthRequest } from "../middlewares/authMiddleware";

export async function chat(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { message, tableId, history } = req.body;
    const result = await aiService.getChatReply({ message, tableId, history });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function recommend(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await aiService.getRecommendations();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
export async function translate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { language } = req.body;
    const result = await aiService.getTranslatedMenu(language);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
export async function analytics(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await aiService.getRestaurantAnalytics();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function trending(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await aiService.getTrendingItems();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}