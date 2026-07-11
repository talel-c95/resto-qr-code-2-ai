import { Response, NextFunction } from "express";
import * as orderService from "../services/orderService";
import { AuthRequest } from "../middlewares/authMiddleware";

export async function createOrder(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { tableId, items, total } = req.body;
    const customerId = req.user?.id;

    const result = await orderService.createOrder({ tableId, items, total, customerId });

    res.status(201).json({
      id: result.order._id.toString(),
      tableId: result.order.tableId,
      status: result.order.status,
      total: result.order.total,
      createdAt: result.order.createdAt,
    });
  } catch (err) {
    next(err);
  }
}

export async function getOrder(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { order } = await orderService.getOrderById(req.params.id);
    res.status(200).json({
      id: order._id.toString(),
      tableId: order.tableId,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
    });
  } catch (err) {
    next(err);
  }
}

export async function getOrderHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      return res.status(200).json([]);
    }
    const orders = await orderService.getOrderHistory(customerId);
    res.status(200).json(
      orders.map((o) => ({
        id: o._id.toString(),
        tableId: o.tableId,
        status: o.status,
        total: o.total,
        createdAt: o.createdAt,
      }))
    );
  } catch (err) {
    next(err);
  }
}