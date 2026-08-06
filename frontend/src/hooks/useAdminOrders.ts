import { useState, useEffect, useCallback } from "react";
import { AdminOrder, OrderStatus } from "@/types/order.types";
import * as adminOrderService from "@/services/adminOrderService";
import { useSocket } from "@/hooks/useSocket";
import { OrderNewPayload, OrderStatusPayload } from "@/types/socket.types";

export function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket();

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminOrderService.getOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (payload: OrderNewPayload) => {
      setOrders((prev) => [{ ...payload, status: payload.status as OrderStatus }, ...prev]);
    };

    const handleStatusUpdate = (payload: OrderStatusPayload) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === payload.id ? { ...o, status: payload.status as OrderStatus } : o))
      );
    };

    socket.on("order:new", handleNewOrder);
    socket.on("order:status", handleStatusUpdate);

    return () => {
      socket.off("order:new", handleNewOrder);
      socket.off("order:status", handleStatusUpdate);
    };
  }, [socket]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    await adminOrderService.updateOrderStatus(id, status);
    // Optimistic update in case the socket round-trip is slow or disconnected;
    // harmless if the "order:status" event arrives right after and sets the same value.
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return { orders, loading, error, updateStatus, refresh };
}