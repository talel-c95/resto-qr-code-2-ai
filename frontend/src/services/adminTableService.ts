import adminApi from "./adminApi";
import { Table } from "@/types/table.types";

export async function getTables(): Promise<Table[]> {
  const res = await adminApi.get<Table[]>("/tables");
  return res.data;
}

export async function createTable(data: { number: number; capacity?: number }): Promise<Table> {
  const res = await adminApi.post<Table>("/tables", data);
  return res.data;
}

export async function deleteTable(id: string): Promise<void> {
  await adminApi.delete(`/tables/${id}`);
}

export async function getTableQrCode(id: string): Promise<{ qrCode: string; tableNumber: number }> {
  const res = await adminApi.get<{ qrCode: string; tableNumber: number }>(`/tables/${id}/qrcode`);
  return res.data;
}