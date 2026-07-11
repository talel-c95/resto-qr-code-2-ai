import { GuestSession } from "../models/GuestSession";

export async function createGuestSession(tableId: string) {
  return GuestSession.create({ tableId });
}

export async function getGuestSession(id: string) {
  return GuestSession.findById(id);
}