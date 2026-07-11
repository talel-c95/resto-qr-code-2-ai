import { Request, Response, NextFunction } from "express";
import * as waiterCallService from "../services/waiterCallService";

export async function callWaiter(req: Request, res: Response, next: NextFunction) {
  try {
    const { tableId } = req.body;
    const call = await waiterCallService.createWaiterCall(tableId);
    res.status(201).json({
      id: call._id.toString(),
      tableId: call.tableId,
      status: call.status,
      createdAt: call.createdAt,
    });
  } catch (err) {
    next(err);
  }
}