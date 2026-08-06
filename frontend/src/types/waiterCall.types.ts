export type WaiterCallStatus = "pending" | "resolved";

export interface WaiterCall {
  id: string;
  tableId: string;
  status: WaiterCallStatus;
  createdAt: string;
}