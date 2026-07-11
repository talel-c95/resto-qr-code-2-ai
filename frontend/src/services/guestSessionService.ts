import api from "./api";

export interface GuestSessionResponse {
  id: string;
  tableId: string;
  createdAt: string;
}

export async function createGuestSession(tableId: string): Promise<GuestSessionResponse> {
  const res = await api.post<GuestSessionResponse>("/guest-session", { tableId });
  return res.data;
}