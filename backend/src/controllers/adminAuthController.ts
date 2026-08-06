import { Response, NextFunction } from "express";
import * as adminAuthService from "../services/adminAuthService";
import { AuthRequest } from "../middlewares/adminAuthMiddleware";

export async function register(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await adminAuthService.registerAdmin(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await adminAuthService.loginAdmin(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const admin = await adminAuthService.getAdminById(req.user!.id);
    res.status(200).json(admin);
  } catch (err) {
    next(err);
  }
}