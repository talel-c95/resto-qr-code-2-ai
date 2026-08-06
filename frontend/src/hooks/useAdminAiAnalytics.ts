import { useState, useEffect, useCallback } from "react";
import { AIAnalyticsResult, AITrendingItem } from "@/types/ai.types";
import * as adminAiService from "@/services/adminAiService";

export function useAdminAIAnalytics() {
  const [analytics, setAnalytics] = useState<AIAnalyticsResult | null>(null);
  const [trending, setTrending] = useState<AITrendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsRes, trendingRes] = await Promise.all([
        adminAiService.getAnalytics(),
        adminAiService.getTrending(),
      ]);
      setAnalytics(analyticsRes);
      setTrending(trendingRes.items);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load AI analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { analytics, trending, loading, error, refresh };
}