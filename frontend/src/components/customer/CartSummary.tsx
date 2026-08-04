import { motion } from "framer-motion";

interface CartSummaryProps {
  total: number;
  onCheckout: () => void;
  disabled?: boolean;
}

export function CartSummary({ total, onCheckout, disabled }: CartSummaryProps) {
  return (
    <div className="border-t border-gold/20 pt-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <span className="text-smoke">Total</span>
        <motion.span
          key={total}
          initial={{ scale: 1.1, color: "#FF8A3D" }}
          animate={{ scale: 1 }}
          className="text-xl font-display font-semibold text-gold"
        >
          {total.toFixed(2)} TND
        </motion.span>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onCheckout}
        disabled={disabled}
        className="w-full bg-gold text-noir py-3 rounded-lg font-semibold hover:brightness-110 active:brightness-95 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Proceed to Checkout
      </motion.button>
    </div>
  );
}