import { useState, useEffect } from "react";
import { MenuItem, Category } from "@/types/menu.types";
import * as menuService from "@/services/menuService";
import { mockMenuItems, mockCategories } from "@/utils/mockMenu";

export function useMenu(tableId: string | undefined) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      try {
        const [menuData, categoryData] = await Promise.all([
          menuService.getMenu(tableId ?? ""),
          menuService.getCategories(),
        ]);
        if (isMounted) {
          setItems(menuData);
          setCategories(categoryData);
          setUsingMockData(false);
        }
      } catch {
        if (isMounted) {
          setItems(mockMenuItems);
          setCategories(mockCategories);
          setUsingMockData(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [tableId]);

  return { items, categories, loading, usingMockData };
}