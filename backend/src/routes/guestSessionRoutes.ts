import { Router } from "express";
import * as guestSessionController from "../controllers/guestSessionController";

const router = Router();

router.post("/", guestSessionController.createSession);

export default router;