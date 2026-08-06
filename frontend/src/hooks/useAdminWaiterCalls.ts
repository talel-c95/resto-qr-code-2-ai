import { useState, useEffect, useCallback } from "react";
import { WaiterCall } from "@/types/waiterCall.types";
import * as adminWaiterCallService from "@/services/adminWaiterCallService";
import { useSocket } from "@/hooks/useSocket";

export function useAdminWaiterCalls() {
  const [calls, setCalls] = useState<WaiterCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket();

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminWaiterCallService.getWaiterCalls();
      setCalls(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load waiter calls");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!socket) return;

    const handleNew = (payload: WaiterCall) => {
      setCalls((prev) => [payload, ...prev]);
    };

    const handleResolved = (payload: { id: string }) => {
      setCalls((prev) => prev.map((c) => (c.id === payload.id ? { ...c, status: "resolved" } : c)));
    };

    socket.on("waiterCall:new", handleNew);
    socket.on("waiterCall:resolved", handleResolved);

    return () => {
      socket.off("waiterCall:new", handleNew);
      socket.off("waiterCall:resolved", handleResolved);
    };
  }, [socket]);

  const resolveCall = async (id: string) => {
    await adminWaiterCallService.resolveWaiterCall(id);
    setCalls((prev) => prev.map((c) => (c.id === id ? { ...c, status: "resolved" } : c)));
  };

  return { calls, loading, error, resolveCall, refresh };
}