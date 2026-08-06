import { Router } from "express";
import * as tableController from "../controllers/tableController";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware";

const router = Router();

router.get("/", adminAuthMiddleware, tableController.getTables);
router.post("/", adminAuthMiddleware, tableController.createTable);
router.delete("/:id", adminAuthMiddleware, tableController.deleteTable);
router.get("/:id/qrcode", adminAuthMiddleware, tableController.getTableQrCode);

export default router;