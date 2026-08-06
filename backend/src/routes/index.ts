
import { Router } from "express";
import authRoutes from "./authRoutes";
import adminAuthRoutes from "./adminAuthRoutes";
// import restaurantRoutes from "./restaurantRoutes";
import categoryRoutes from "./categoryRoutes";
import menuRoutes from "./menuRoutes";
import tableRoutes from "./tableRoutes";
import orderRoutes from "./orderRoutes";
// import cartRoutes from "./cartRoutes";
import waiterCallRoutes from "./waiterCallRoutes";
import aiRoutes from "./aiRoutes";
import receiptRoutes from "./receiptRoutes";
import guestSessionRoutes from "./guestSessionRoutes";
import analyticsRoutes from "./analyticsRoutes";
const router = Router();

router.use("/auth", authRoutes);
router.use("/admin/auth", adminAuthRoutes);
// router.use("/restaurants", restaurantRoutes);
router.use("/categories", categoryRoutes);
router.use("/menu", menuRoutes);
router.use("/tables", tableRoutes);
router.use("/orders", orderRoutes);
// router.use("/cart", cartRoutes);
router.use("/waiter-call", waiterCallRoutes);
router.use("/receipts", receiptRoutes);
router.use("/guest-session", guestSessionRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/ai", aiRoutes);

export default router;