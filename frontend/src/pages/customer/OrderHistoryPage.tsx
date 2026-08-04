import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import * as orderService from "@/services/orderService";
import { mockOrderHistory } from "@/utils/mockOrderHistory";
import { Order } from "@/types/order.types";

const statusColors: Record<string, string> = {
  completed: "bg-green-900/40 text-green-400",
  cancelled: "bg-rust/20 text-rust",
  pending: "bg-yellow-900/40 text-yellow-400",
  accepted: "bg-blue-900/40 text-blue-400",
  preparing: "bg-orange-900/40 text-orange-400",
  ready: "bg-purple-900/40 text-purple-400",
  served: "bg-smoke/20 text-smoke",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
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
      <div className="min-h-screen bg-noir flex items-center justify-center">
        <p className="text-smoke">Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noir px-4 sm:px-6 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl font-semibold text-linen mb-1"
      >
        Order History
      </motion.h1>
      {usingMockData && (
        <p className="text-xs text-gold mb-4">
          Showing sample history — backend not connected yet
        </p>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-3 mt-4 max-w-2xl mx-auto sm:mx-0"
      >
        {orders.map((order) => (
          <motion.button
            key={order.id}
            variants={item}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate(`/receipt/${order.id}`)}
            className="bg-charcoal border border-gold/10 rounded-xl p-4 flex justify-between items-center text-left hover:border-gold/30 transition-colors"
          >
            <div>
              <p className="font-medium text-linen">Order #{order.id}</p>
              <p className="text-xs text-smoke">
                Table {order.tableId} · {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gold">{order.total.toFixed(2)} TND</p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status] ?? "bg-smoke/20 text-smoke"}`}
              >
                {order.status}
              </span>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}