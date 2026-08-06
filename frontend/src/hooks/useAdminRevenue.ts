import { useState, useEffect, useCallback } from "react";
import { RevenueSummary } from "@/types/analytics.types";
import * as adminAnalyticsService from "@/services/adminAnalyticsService";

export function useAdminRevenue() {
  const [summary, setSummary] = useState<RevenueSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminAnalyticsService.getRevenueSummary();
      setSummary(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load revenue data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { summary, loading, error, refresh };
}