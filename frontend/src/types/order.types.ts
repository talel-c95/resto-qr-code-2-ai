
export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "served"
  | "completed"
  | "cancelled";

export interface Order {
  id: string;
  tableId: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
}
export interface OrderItemSummary {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface AdminOrder extends Order {
  items: OrderItemSummary[];
}