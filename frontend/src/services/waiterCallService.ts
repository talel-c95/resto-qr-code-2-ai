import api from "./api";

export interface WaiterCallResponse {
  id: string;
  tableId: string;
  status: string;
  createdAt: string;
}

export async function callWaiter(tableId: string): Promise<WaiterCallResponse> {
  const res = await api.post<WaiterCallResponse>("/waiter-call", { tableId });
  return res.data;
}