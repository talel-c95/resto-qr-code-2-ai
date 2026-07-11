import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.registerCustomer(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.loginCustomer(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}