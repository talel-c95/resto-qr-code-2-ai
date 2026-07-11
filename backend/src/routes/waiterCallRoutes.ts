import { Router } from "express";
import * as waiterCallController from "../controllers/waiterCallController";

const router = Router();

router.post("/", waiterCallController.callWaiter);

export default router;