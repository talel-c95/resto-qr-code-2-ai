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

export async function getWaiterCalls(req: Request, res: Response, next: NextFunction) {
  try {
    const calls = await waiterCallService.getAllWaiterCalls();
    res.status(200).json(
      calls.map((c) => ({
        id: c._id.toString(),
        tableId: c.tableId,
        status: c.status,
        createdAt: c.createdAt,
      }))
    );
  } catch (err) {
    next(err);
  }
}

export async function resolveWaiterCall(req: Request, res: Response, next: NextFunction) {
  try {
    const call = await waiterCallService.resolveWaiterCall(req.params.id);
    res.status(200).json({
      id: call._id.toString(),
      tableId: call.tableId,
      status: call.status,
      createdAt: call.createdAt,
    });
  } catch (err) {
    next(err);
  }
}