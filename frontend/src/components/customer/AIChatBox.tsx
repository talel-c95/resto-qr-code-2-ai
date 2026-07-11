import { useState, useRef, useEffect } from "react";
import { useAIChat } from "@/hooks/useAIChat";
import { AIChatMessage } from "@/components/customer/AIChatMessage";

interface AIChatBoxProps {
  tableId?: string;
}

export function AIChatBox({ tableId }: AIChatBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, loading, error, suggestedItemIds, sendMessage } = useAIChat(tableId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setInput("");
    sendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-black text-white shadow-lg flex items-center justify-center text-2xl hover:bg-gray-800 transition z-50"
      >
        {isOpen ? "✕" : "🤖"}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">AI Waiter</h3>
            <p className="text-xs text-gray-500">Ask about dishes, allergens, or get recommendations</p>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3">
            {messages.length === 0 && (
              <p className="text-sm text-gray-400 text-center mt-8">
                Say hi! Ask me what's spicy, vegetarian, or a good pick under your budget.
              </p>
            )}

            {messages.map((msg) => (
              <AIChatMessage key={msg.id} message={msg} />
            ))}

            {loading && (
              <div className="flex justify-start mb-3">
                <div className="bg-gray-100 text-gray-500 rounded-2xl rounded-bl-sm px-4 py-2 text-sm">
                  Typing...
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-xs text-center mt-2">{error}</p>}

            <div ref={scrollRef} />
          </div>

          <div className="border-t border-gray-200 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-black"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-black text-white rounded-full w-9 h-9 flex items-center justify-center disabled:opacity-40"
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}