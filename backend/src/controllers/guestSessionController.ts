import { Request, Response, NextFunction } from "express";
import * as guestSessionService from "../services/guestSessionService";

export async function createSession(req: Request, res: Response, next: NextFunction) {
  try {
    const { tableId } = req.body;
    const session = await guestSessionService.createGuestSession(tableId);
    res.status(201).json({
      id: session._id.toString(),
      tableId: session.tableId,
      createdAt: session.createdAt,
    });
  } catch (err) {
    next(err);
  }
}