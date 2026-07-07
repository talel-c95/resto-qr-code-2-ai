/**
 * Order status enum — mirrors MongoDB order lifecycle.
 */

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "served"
  | "completed"
  | "cancelled";

export type UserRole = "admin" | "customer" | "guest";
