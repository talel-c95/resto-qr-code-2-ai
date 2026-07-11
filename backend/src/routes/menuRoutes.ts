import { Router } from "express";
import * as menuController from "../controllers/menuController";

const router = Router();

router.get("/", menuController.getMenu);

export default router;