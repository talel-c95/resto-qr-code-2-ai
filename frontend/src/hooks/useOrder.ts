import { useState } from "react";
import * as orderService from "@/services/orderService";
import { CreateOrderPayload } from "@/services/orderService";
import { Order } from "@/types/order.types";

export function useOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitOrder = async (payload: CreateOrderPayload): Promise<Order | null> => {
    setLoading(true);
    setError(null);
    try {
      const order = await orderService.createOrder(payload);
      return order;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to place order");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submitOrder, loading, error };
}