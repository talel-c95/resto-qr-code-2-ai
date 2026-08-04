import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/components/customer/CartItem";
import { CartSummary } from "@/components/customer/CartSummary";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-noir flex flex-col items-center justify-center px-6 text-center"
      >
        <ShoppingBag size={40} strokeWidth={1.5} className="text-smoke mb-4" />
        <h1 className="font-display text-2xl font-semibold text-linen mb-2">
          Your Cart is Empty
        </h1>
        <p className="text-smoke mb-6">Add some items from the menu to get started.</p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(-1)}
          className="bg-gold text-noir px-6 py-3 rounded-lg font-semibold hover:brightness-110 transition-colors"
        >
          Back to Menu
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-noir px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-linen mb-6">Your Cart</h1>

      <div className="bg-charcoal border border-gold/10 rounded-xl p-4 max-w-2xl mx-auto sm:mx-0">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <CartItem
              key={item.menuItemId}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </AnimatePresence>

        <CartSummary total={total} onCheckout={() => navigate("/checkout")} />
      </div>
    </div>
  );
}