import { useState, useEffect, useCallback } from "react";
import { MenuItem } from "@/types/menu.types";
import * as adminMenuService from "@/services/adminMenuService";

export function useAdminMenuItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminMenuService.getMenuItems();
      setItems(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load menu items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createMenuItem = async (data: Omit<MenuItem, "id">) => {
    await adminMenuService.createMenuItem(data);
    await refresh();
  };

  const updateMenuItem = async (id: string, data: Partial<Omit<MenuItem, "id">>) => {
    await adminMenuService.updateMenuItem(id, data);
    await refresh();
  };

  const deleteMenuItem = async (id: string) => {
    await adminMenuService.deleteMenuItem(id);
    await refresh();
  };

  return { items, loading, error, createMenuItem, updateMenuItem, deleteMenuItem, refresh };
}