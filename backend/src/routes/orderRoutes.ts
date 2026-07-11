import { Router } from "express";
import * as orderController from "../controllers/orderController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { verifyToken } from "../utils/jwt";

const router = Router();

function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      req.user = verifyToken(authHeader.split(" ")[1]);
    } catch {
      
    }
  }
  next();
}

router.post("/", optionalAuth, orderController.createOrder);
router.get("/history", authMiddleware, orderController.getOrderHistory);
router.get("/:id", orderController.getOrder);

export default router;