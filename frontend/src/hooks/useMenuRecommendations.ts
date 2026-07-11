import { useState, useEffect } from "react";
import * as aiService from "@/services/aiService";
import { AIRecommendation } from "@/types/ai.types";

export function useMenuRecommendations() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await aiService.getRecommendations();
        if (isMounted) setRecommendations(data);
      } catch {
        if (isMounted) setRecommendations([]); // fail quietly, badges just won't show
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { recommendations, loading };
}