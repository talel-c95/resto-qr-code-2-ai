import adminApi from "./adminApi";
import { WaiterCall } from "@/types/waiterCall.types";

export async function getWaiterCalls(): Promise<WaiterCall[]> {
  const res = await adminApi.get<WaiterCall[]>("/waiter-call");
  return res.data;
}

export async function resolveWaiterCall(id: string): Promise<WaiterCall> {
  const res = await adminApi.patch<WaiterCall>(`/waiter-call/${id}`);
  return res.data;
}