import { useState } from "react";
import * as aiService from "@/services/aiService";
import { ChatMessage } from "@/types/ai.types";

export function useAIChat(tableId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedItemIds, setSuggestedItemIds] = useState<string[]>([]);

  const sendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));

      const response = await aiService.sendChatMessage({
        message: text,
        tableId,
        history,
      });

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.reply,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setSuggestedItemIds(response.suggestedItemIds);
    } catch (err: any) {
      setError(err?.response?.data?.message || "AI waiter is unavailable right now");
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, error, suggestedItemIds, sendMessage };
}