import { Router } from "express";
import * as receiptController from "../controllers/receiptController";

const router = Router();

router.get("/:orderId", receiptController.getReceipt);

export default router;