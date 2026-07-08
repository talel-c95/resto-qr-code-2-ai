import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import * as orderService from "@/services/orderService";
import { mockOrderHistory } from "@/utils/mockOrderHistory";
import { Order } from "@/types/order.types";

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  ready: "bg-purple-100 text-purple-700",
  served: "bg-gray-100 text-gray-700",
};

export default function OrderHistoryPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await orderService.getOrderHistory();
        if (isMounted) {
          setOrders(data);
          setUsingMockData(false);
        }
      } catch {
        if (isMounted) {
          setOrders(mockOrderHistory);
          setUsingMockData(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Order History</h1>
      {usingMockData && (
        <p className="text-xs text-orange-500 mb-4">
          Showing sample history — backend not connected yet
        </p>
      )}

      <div className="flex flex-col gap-3 mt-4">
        {orders.map((order) => (
          <button
            key={order.id}
            onClick={() => navigate(`/receipt/${order.id}`)}
            className="bg-white rounded-xl p-4 flex justify-between items-center text-left hover:bg-gray-100 transition"
          >
            <div>
              <p className="font-medium text-gray-900">Order #{order.id}</p>
              <p className="text-xs text-gray-400">
                Table {order.tableId} · {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{order.total.toFixed(2)} TND</p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status] ?? "bg-gray-100 text-gray-700"}`}
              >
                {order.status}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}