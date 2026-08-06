import { Request, Response, NextFunction } from "express";
import * as analyticsService from "../services/analyticsService";

export async function getRevenueSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const summary = await analyticsService.getRevenueSummary();
    res.status(200).json(summary);
  } catch (err) {
    next(err);
  }
}