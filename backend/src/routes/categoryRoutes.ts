import { Router } from "express";
import * as categoryController from "../controllers/categoryController";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware";

const router = Router();

router.get("/", categoryController.getCategories);
router.post("/", adminAuthMiddleware, categoryController.createCategory);
router.put("/:id", adminAuthMiddleware, categoryController.updateCategory);
router.delete("/:id", adminAuthMiddleware, categoryController.deleteCategory);

export default router;