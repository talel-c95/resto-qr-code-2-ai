import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { OrderStatusTracker } from "@/components/customer/OrderStatusTracker";
import { OrderStatus } from "@/types/order.types";
import * as orderService from "@/services/orderService";

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    async function fetchStatus() {
      try {
        const order = await orderService.getOrder(id!);
        if (isMounted) {
          setStatus(order.status);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError("Could not load order status");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 4000); // poll every 4s until Socket.IO is wired

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading order status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Tracking</h1>
      <p className="text-sm text-gray-500 mb-6">Order #{id}</p>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="bg-white rounded-xl p-6 mb-6">
        <OrderStatusTracker status={status} />
      </div>

      {status === "completed" && (
        <button
          onClick={() => navigate(`/receipt/${id}`)}
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
        >
          View Receipt
        </button>
      )}

      <p className="text-xs text-gray-400 mt-4 text-center">
        Status updates every few seconds. Live push updates via Socket.IO coming soon.
      </p>
    </div>
  );
}