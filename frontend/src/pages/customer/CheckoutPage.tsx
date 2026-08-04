import { useNavigate, useParams } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { ClipboardList, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useOrder } from "@/hooks/useOrder";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { submitOrder, loading, error } = useOrder();
  const navigate = useNavigate();
  const { tableId } = useParams<{ tableId: string }>();

  const resolvedTableId = tableId || sessionStorage.getItem("tableId") || "unknown";

  const handleConfirm = async () => {
    const order = await submitOrder({
      tableId: resolvedTableId,
      items: items.map((i) => ({
        menuItemId: i.menuItemId,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      })),
      total,
    });

    if (order) {
      clearCart();
      navigate(`/orders/${order.id}`);
    } else {
      clearCart();
      navigate(`/orders/mock-order-1`);
    }
  };

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-noir flex flex-col items-center justify-center px-6 text-center"
      >
        <ClipboardList size={40} strokeWidth={1.5} className="text-smoke mb-4" />
        <h1 className="font-display text-2xl font-semibold text-linen mb-2">
          Nothing to Checkout
        </h1>
        <p className="text-smoke mb-6">Your cart is empty.</p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/")}
          className="bg-gold text-noir px-6 py-3 rounded-lg font-semibold hover:brightness-110 transition-colors"
        >
          Back to Menu
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-noir px-4 sm:px-6 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl font-semibold text-linen mb-6"
      >
        Checkout
      </motion.h1>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="bg-charcoal border border-gold/10 rounded-xl p-4 mb-6 max-w-2xl mx-auto sm:mx-0"
      >
        <h2 className="font-semibold text-linen mb-3">Order Summary</h2>
        {items.map((cartItem) => (
          <motion.div
            key={cartItem.menuItemId}
            variants={item}
            className="flex justify-between py-2 text-sm text-smoke"
          >
            <span>
              {cartItem.quantity} × {cartItem.name}
            </span>
            <span className="text-linen">
              {(cartItem.price * cartItem.quantity).toFixed(2)} TND
            </span>
          </motion.div>
        ))}
        <motion.div
          variants={item}
          className="flex justify-between border-t border-gold/20 mt-3 pt-3 font-display font-semibold"
        >
          <span className="text-linen">Total</span>
          <span className="text-gold">{total.toFixed(2)} TND</span>
        </motion.div>
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-rust text-sm mb-4 max-w-2xl mx-auto sm:mx-0"
        >
          {error}
        </motion.p>
      )}

      <div className="max-w-2xl mx-auto sm:mx-0">
        <motion.button
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          onClick={handleConfirm}
          disabled={loading}
          className="w-full bg-gold text-noir py-3 rounded-lg font-semibold hover:brightness-110 active:brightness-95 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            >
              <Loader2 size={18} strokeWidth={2} />
            </motion.span>
          )}
          {loading ? "Placing order..." : "Confirm Order"}
        </motion.button>
      </div>
    </div>
  );
}