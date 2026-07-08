import api from "./api";
import { Order } from "@/types/order.types";
import { CartItem } from "@/types/cart.types";

export interface CreateOrderPayload {
  tableId: string;
  items: CartItem[];
  total: number;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const res = await api.post<Order>("/orders", payload);
  return res.data;
}

export async function getOrder(orderId: string): Promise<Order> {
  const res = await api.get<Order>(`/orders/${orderId}`);
  return res.data;
}
export async function getOrderHistory(): Promise<Order[]> {
  const res = await api.get<Order[]>("/orders/history");
  return res.data;
}