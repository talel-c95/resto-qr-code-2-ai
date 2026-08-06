import adminApi from "./adminApi";
import { Category, MenuItem } from "@/types/menu.types";

export async function getCategories(): Promise<Category[]> {
  const res = await adminApi.get<Category[]>("/categories");
  return res.data;
}

export async function createCategory(data: { name: string }): Promise<Category> {
  const res = await adminApi.post<Category>("/categories", data);
  return res.data;
}

export async function updateCategory(id: string, data: { name: string }): Promise<Category> {
  const res = await adminApi.put<Category>(`/categories/${id}`, data);
  return res.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await adminApi.delete(`/categories/${id}`);
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const res = await adminApi.get<MenuItem[]>("/menu");
  return res.data;
}

export async function createMenuItem(data: Omit<MenuItem, "id">): Promise<MenuItem> {
  const res = await adminApi.post<MenuItem>("/menu", data);
  return res.data;
}

export async function updateMenuItem(id: string, data: Partial<Omit<MenuItem, "id">>): Promise<MenuItem> {
  const res = await adminApi.put<MenuItem>(`/menu/${id}`, data);
  return res.data;
}

export async function deleteMenuItem(id: string): Promise<void> {
  await adminApi.delete(`/menu/${id}`);
}