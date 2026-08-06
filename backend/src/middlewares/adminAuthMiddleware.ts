import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";
import { AppError } from "../utils/errors";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function adminAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Not authenticated", 401));
  }

  const token = authHeader.split(" ")[1];

  let decoded: JwtPayload;
  try {
    decoded = verifyToken(token);
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }

  if (decoded.role !== "admin") {
    return next(new AppError("Admin access required", 403));
  }

  req.user = decoded;
  next();
}