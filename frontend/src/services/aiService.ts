import api from "./api";
import { AIChatRequestPayload, AIChatResponse, AIRecommendation,AITranslateResult, MenuLanguage  } from "@/types/ai.types";

export async function sendChatMessage(payload: AIChatRequestPayload): Promise<AIChatResponse> {
  const res = await api.post<AIChatResponse>("/ai/chat", payload);
  return res.data;
}

export async function getRecommendations(): Promise<AIRecommendation[]> {
  const res = await api.post<{ recommendations: AIRecommendation[] }>("/ai/recommend", {});
  return res.data.recommendations;
}
export async function getTranslatedMenu(language: MenuLanguage): Promise<AITranslateResult> {
  const res = await api.post<AITranslateResult>("/ai/translate", { language });
  return res.data;
}