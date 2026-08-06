import adminApi from "./adminApi";
import { AdminOrder, OrderStatus } from "@/types/order.types";

export async function getOrders(): Promise<AdminOrder[]> {
  const res = await adminApi.get<AdminOrder[]>("/orders");
  return res.data;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<AdminOrder> {
  const res = await adminApi.patch<AdminOrder>(`/orders/${id}/status`, { status });
  return res.data;
}