import adminApi from "./adminApi";
import { AIAnalyticsResult, AITrendingResult } from "@/types/ai.types";

export async function getAnalytics(): Promise<AIAnalyticsResult> {
  const res = await adminApi.get<AIAnalyticsResult>("/ai/analytics");
  return res.data;
}

export async function getTrending(): Promise<AITrendingResult> {
  const res = await adminApi.get<AITrendingResult>("/ai/trending");
  return res.data;
}