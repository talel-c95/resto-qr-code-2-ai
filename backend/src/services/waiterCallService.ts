import { WaiterCall } from "../models/WaiterCall";

export async function createWaiterCall(tableId: string) {
  return WaiterCall.create({ tableId, status: "pending" });
}