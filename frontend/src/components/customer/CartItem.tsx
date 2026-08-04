import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItemWithMeta } from "@/context/CartContext";

interface CartItemProps {
  item: CartItemWithMeta;
  onUpdateQuantity: (menuItemId: string, quantity: number) => void;
  onRemove: (menuItemId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gold/10 py-4 gap-3"
    >
      <div className="flex-1">
        <h3 className="font-medium text-linen">{item.name}</h3>
        <p className="text-sm text-smoke">{item.price.toFixed(2)} TND each</p>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => onUpdateQuantity(item.menuItemId, item.quantity - 1)}
            className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center text-linen hover:border-gold hover:text-gold transition-colors"
          >
            <Minus size={14} strokeWidth={2} />
          </motion.button>
          <motion.span
            key={item.quantity}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="w-6 text-center font-mono text-linen"
          >
            {item.quantity}
          </motion.span>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => onUpdateQuantity(item.menuItemId, item.quantity + 1)}
            className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center text-linen hover:border-gold hover:text-gold transition-colors"
          >
            <Plus size={14} strokeWidth={2} />
          </motion.button>
        </div>

        <div className="text-right font-medium text-gold min-w-[70px]">
          {(item.price * item.quantity).toFixed(2)} TND
        </div>

        <motion.button
          whileTap={{ scale: 0.85 }}
          whileHover={{ rotate: -8 }}
          onClick={() => onRemove(item.menuItemId)}
          className="text-smoke hover:text-rust transition-colors p-1"
          aria-label="Remove item"
        >
          <Trash2 size={16} strokeWidth={1.75} />
        </motion.button>
      </div>
    </motion.div>
  );
}