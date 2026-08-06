import adminApi from "./adminApi";
import { RevenueSummary } from "@/types/analytics.types";

export async function getRevenueSummary(): Promise<RevenueSummary> {
  const res = await adminApi.get<RevenueSummary>("/analytics/revenue");
  return res.data;
}