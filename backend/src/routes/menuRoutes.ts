import { Router } from "express";
import * as menuController from "../controllers/menuController";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware";

const router = Router();

router.get("/", menuController.getMenu);
router.post("/", adminAuthMiddleware, menuController.createMenuItem);
router.put("/:id", adminAuthMiddleware, menuController.updateMenuItem);
router.delete("/:id", adminAuthMiddleware, menuController.deleteMenuItem);

export default router;