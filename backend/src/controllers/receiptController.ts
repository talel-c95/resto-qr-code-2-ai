import { Request, Response, NextFunction } from "express";
import * as receiptService from "../services/receiptService";

export async function getReceipt(req: Request, res: Response, next: NextFunction) {
  try {
    const receipt = await receiptService.getReceiptForOrder(req.params.orderId);
    res.status(200).json(receipt);
  } catch (err) {
    next(err);
  }
}