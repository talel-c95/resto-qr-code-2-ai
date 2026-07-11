/**
 * aiRoutes — backend/src/routes
 */

import { Router } from "express";
import * as aiController from "../controllers/aiController";

const router = Router();

router.post("/chat", aiController.chat);
router.post("/recommend", aiController.recommend);
router.post("/translate", aiController.translate);
export default router;