import api from "./api";
import { MenuItem, Category } from "@/types/menu.types";

export async function getMenu(tableId: string): Promise<MenuItem[]> {
  const res = await api.get<MenuItem[]>(`/menu`, { params: { tableId } });
  return res.data;
}

export async function getCategories(): Promise<Category[]> {
  const res = await api.get<Category[]>(`/categories`);
  return res.data;
}