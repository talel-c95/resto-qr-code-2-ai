import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { OrderStatusTracker } from "@/components/customer/OrderStatusTracker";
import { OrderStatus } from "@/types/order.types";

const mockProgression: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "served",
  "completed",
];

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Mock auto-progression until Socket.IO is connected to the real backend
    if (stepIndex >= mockProgression.length - 1) return;

    const timer = setTimeout(() => {
      const next = stepIndex + 1;
      setStepIndex(next);
      setStatus(mockProgression[next]);
    }, 3000);

    return () => clearTimeout(timer);
  }, [stepIndex]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Tracking</h1>
      <p className="text-sm text-gray-500 mb-6">Order #{id}</p>

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
        Live updates via Socket.IO will replace this simulation once connected to the backend.
      </p>
    </div>
  );
}