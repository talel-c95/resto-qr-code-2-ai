import { Router } from "express";
import * as adminAuthController from "../controllers/adminAuthController";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware";

const router = Router();

router.post("/register", adminAuthController.register);
router.post("/login", adminAuthController.login);
router.get("/me", adminAuthMiddleware, adminAuthController.me);

export default router;