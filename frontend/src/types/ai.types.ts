/**
 * AI chat and recommendation types.
 */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AIRecommendation {
  menuItemId: string;
  reason: string;
}
export interface AIChatRequestPayload {
  message: string;
  tableId?: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

export interface AIChatResponse {
  reply: string;
  suggestedItemIds: string[];
}
export type MenuLanguage = "en" | "fr" | "ar";

export interface TranslatedMenuItem {
  menuItemId: string;
  name: string;
  description: string;
}

export interface AITranslateResult {
  language: MenuLanguage;
  items: TranslatedMenuItem[];
}
export interface AIAnalyticsResult {
  summary: string;
  insights: string[];
  suggestions: string[];
}

export interface AITrendingItem {
  menuItemId: string;
  name: string;
  recentOrders: number;
  previousOrders: number;
  blurb: string;
}

export interface AITrendingResult {
  items: AITrendingItem[];
}