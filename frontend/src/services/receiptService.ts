import api from "./api";

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

export interface ReceiptData {
  orderId: string;
  tableId: string;
  total: number;
  createdAt: string;
  items: ReceiptItem[];
}

export async function getReceipt(orderId: string): Promise<ReceiptData> {
  const res = await api.get<ReceiptData>(`/receipts/${orderId}`);
  return res.data;
}