import { Router } from "express";
import * as waiterCallController from "../controllers/waiterCallController";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware";

const router = Router();

router.post("/", waiterCallController.callWaiter);
router.get("/", adminAuthMiddleware, waiterCallController.getWaiterCalls);
router.patch("/:id", adminAuthMiddleware, waiterCallController.resolveWaiterCall);

export default router;