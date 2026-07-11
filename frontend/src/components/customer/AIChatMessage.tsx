import { ChatMessage } from "@/types/ai.types";

interface AIChatMessageProps {
  message: ChatMessage;
}

export function AIChatMessage({ message }: AIChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
          isUser
            ? "bg-black text-white rounded-br-sm"
            : "bg-gray-100 text-gray-900 rounded-bl-sm"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}