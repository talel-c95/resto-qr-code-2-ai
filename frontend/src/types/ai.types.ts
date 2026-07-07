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
