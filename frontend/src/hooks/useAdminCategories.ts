import { useState, useEffect, useCallback } from "react";
import { Category } from "@/types/menu.types";
import * as adminMenuService from "@/services/adminMenuService";

export function useAdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminMenuService.getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createCategory = async (data: { name: string }) => {
    await adminMenuService.createCategory(data);
    await refresh();
  };

  const updateCategory = async (id: string, data: { name: string }) => {
    await adminMenuService.updateCategory(id, data);
    await refresh();
  };

  const deleteCategory = async (id: string) => {
    await adminMenuService.deleteCategory(id);
    await refresh();
  };

  return { categories, loading, error, createCategory, updateCategory, deleteCategory, refresh };
}