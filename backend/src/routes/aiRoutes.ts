/**
 * aiRoutes — backend/src/routes
 */

import { Router } from "express";
import * as aiController from "../controllers/aiController";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware";

const router = Router();

router.post("/chat", aiController.chat);
router.post("/recommend", aiController.recommend);
router.post("/translate", aiController.translate);

router.get("/analytics", adminAuthMiddleware, aiController.analytics);
router.get("/trending", adminAuthMiddleware, aiController.trending);

export default router;