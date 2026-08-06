import { useState, useEffect, useCallback } from "react";
import { Table } from "@/types/table.types";
import * as adminTableService from "@/services/adminTableService";

export function useAdminTables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminTableService.getTables();
      setTables(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load tables");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createTable = async (data: { number: number; capacity?: number }) => {
    await adminTableService.createTable(data);
    await refresh();
  };

  const deleteTable = async (id: string) => {
    await adminTableService.deleteTable(id);
    await refresh();
  };

  return { tables, loading, error, createTable, deleteTable, refresh };
}