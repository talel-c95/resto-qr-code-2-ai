import { Table } from "../models/Table";
import { AppError } from "../utils/errors";

export async function getAllTables() {
  return Table.find().sort({ number: 1 });
}

export async function createTable(data: { number: number; capacity?: number; restaurantId?: string }) {
  if (data.number === undefined || data.number === null) {
    throw new AppError("Table number is required", 400);
  }
  const existing = await Table.findOne({ number: data.number });
  if (existing) {
    throw new AppError("A table with this number already exists", 409);
  }
  return Table.create({
    number: data.number,
    capacity: data.capacity,
    restaurantId: data.restaurantId || "r1",
  });
}

export async function deleteTable(id: string) {
  const table = await Table.findById(id);
  if (!table) {
    throw new AppError("Table not found", 404);
  }
  await table.deleteOne();
}

export async function getTableById(id: string) {
  const table = await Table.findById(id);
  if (!table) {
    throw new AppError("Table not found", 404);
  }
  return table;
}