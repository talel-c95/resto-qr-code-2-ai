import { Router } from "express";
import * as analyticsController from "../controllers/analyticsController";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware";

const router = Router();

router.get("/revenue", adminAuthMiddleware, analyticsController.getRevenueSummary);

export default router;