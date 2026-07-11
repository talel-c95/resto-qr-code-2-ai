
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