import { Request, Response, NextFunction } from "express";
import * as tableService from "../services/tableService";
import * as qrCodeService from "../services/qrCodeService";

function formatTable(table: any) {
  return {
    id: table._id.toString(),
    number: table.number,
    restaurantId: table.restaurantId,
    capacity: table.capacity,
    isActive: table.isActive,
  };
}

export async function getTables(req: Request, res: Response, next: NextFunction) {
  try {
    const tables = await tableService.getAllTables();
    res.status(200).json(tables.map(formatTable));
  } catch (err) {
    next(err);
  }
}

export async function createTable(req: Request, res: Response, next: NextFunction) {
  try {
    const table = await tableService.createTable(req.body);
    res.status(201).json(formatTable(table));
  } catch (err) {
    next(err);
  }
}

export async function deleteTable(req: Request, res: Response, next: NextFunction) {
  try {
    await tableService.deleteTable(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getTableQrCode(req: Request, res: Response, next: NextFunction) {
  try {
    const table = await tableService.getTableById(req.params.id);
    const qrDataUrl = await qrCodeService.generateTableQrCode(table.number);
    res.status(200).json({ qrCode: qrDataUrl, tableNumber: table.number });
  } catch (err) {
    next(err);
  }
}