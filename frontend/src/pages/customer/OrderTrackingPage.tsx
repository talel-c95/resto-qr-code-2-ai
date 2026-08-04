import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
    const interval = setInterval(fetchStatus, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-noir flex items-center justify-center">
        <p className="text-smoke">Loading order status...</p>
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
        Order Tracking
      </motion.h1>
      <p className="text-sm text-smoke mb-6">Order #{id}</p>

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rust text-sm mb-4">
          {error}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-charcoal border border-gold/10 rounded-xl p-6 mb-6 max-w-md mx-auto sm:mx-0"
      >
        <OrderStatusTracker status={status} />
      </motion.div>

      <AnimatePresence>
        {status === "completed" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto sm:mx-0"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/receipt/${id}`)}
              className="w-full bg-gold text-noir py-3 rounded-lg font-semibold hover:brightness-110 transition-colors"
            >
              View Receipt
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-smoke mt-4 text-center">
        Status updates every few seconds. Live push updates via Socket.IO coming soon.
      </p>
    </div>
  );
}