
export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface AIChatRequestBody {
  message: string;
  tableId?: string;
  history?: ChatMessage[]; 
}

export interface AIChatResult {
  reply: string;
  suggestedItemIds: string[]; 
}
export interface AIRecommendationItem {
  menuItemId: string;
  reason: string;
}

export interface AIRecommendResult {
  recommendations: AIRecommendationItem[];
}
export type MenuLanguage = "fr" | "en" | "ar";

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