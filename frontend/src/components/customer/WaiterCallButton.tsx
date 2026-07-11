import { useState } from "react";
import * as waiterCallService from "@/services/waiterCallService";

interface WaiterCallButtonProps {
  tableId: string;
}

export function WaiterCallButton({ tableId }: WaiterCallButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  const handleCall = async () => {
    setStatus("loading");
    try {
      await waiterCallService.callWaiter(tableId);
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <button
      onClick={handleCall}
      disabled={status === "loading" || status === "sent"}
      className={`fixed bottom-24 right-6 rounded-full px-5 py-3 font-medium shadow-lg transition ${
        status === "sent"
          ? "bg-green-600 text-white"
          : status === "error"
          ? "bg-red-600 text-white"
          : "bg-black text-white hover:bg-gray-800"
      }`}
    >
      {status === "loading" && "Calling..."}
      {status === "sent" && "✓ Waiter Notified"}
      {status === "error" && "Failed — Try Again"}
      {status === "idle" && "🔔 Call Waiter"}
    </button>
  );
}