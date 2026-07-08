import { Order } from "@/types/order.types";

export const mockOrderHistory: Order[] = [
  {
    id: "order-101",
    tableId: "5",
    status: "completed",
    total: 28.5,
    createdAt: "2026-07-01T19:32:00Z",
  },
  {
    id: "order-98",
    tableId: "3",
    status: "completed",
    total: 42.0,
    createdAt: "2026-06-24T13:10:00Z",
  },
  {
    id: "order-77",
    tableId: "5",
    status: "cancelled",
    total: 15.0,
    createdAt: "2026-06-10T20:05:00Z",
  },
];