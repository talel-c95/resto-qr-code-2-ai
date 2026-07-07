/**
 * Order types.
 */

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
