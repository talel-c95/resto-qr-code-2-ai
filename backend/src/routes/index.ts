/**
 * API route aggregator.
 *
 * /api/auth          → authRoutes
 * /api/restaurants   → restaurantRoutes
 * /api/categories    → categoryRoutes
 * /api/menu          → menuRoutes
 * /api/tables        → tableRoutes
 * /api/orders        → orderRoutes
 * /api/cart          → cartRoutes
 * /api/waiter-call   → waiterCallRoutes
 * /api/ai            → aiRoutes
 */

import { Router } from "express";
// import authRoutes from "./authRoutes";
// import restaurantRoutes from "./restaurantRoutes";
// import categoryRoutes from "./categoryRoutes";
// import menuRoutes from "./menuRoutes";
// import tableRoutes from "./tableRoutes";
// import orderRoutes from "./orderRoutes";
// import cartRoutes from "./cartRoutes";
// import waiterCallRoutes from "./waiterCallRoutes";
// import aiRoutes from "./aiRoutes";

const router = Router();

// router.use("/auth", authRoutes);
// router.use("/restaurants", restaurantRoutes);
// router.use("/categories", categoryRoutes);
// router.use("/menu", menuRoutes);
// router.use("/tables", tableRoutes);
// router.use("/orders", orderRoutes);
// router.use("/cart", cartRoutes);
// router.use("/waiter-call", waiterCallRoutes);
// router.use("/ai", aiRoutes);

export default router;
