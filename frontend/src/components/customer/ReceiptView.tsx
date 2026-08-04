import { motion } from "framer-motion";

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

interface ReceiptViewProps {
  orderId: string;
  tableId: string;
  items: ReceiptItem[];
  total: number;
  createdAt: string;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export function ReceiptView({ orderId, tableId, items, total, createdAt }: ReceiptViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="bg-charcoal border border-gold/10 rounded-xl p-6 max-w-sm mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="font-display text-lg font-semibold text-linen">Receipt</h2>
        <p className="text-xs text-smoke">Order #{orderId}</p>
        <p className="text-xs text-smoke">Table {tableId}</p>
        <p className="text-xs text-smoke">{new Date(createdAt).toLocaleString()}</p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="border-t border-dashed border-gold/20 pt-4">
        {items.map((receiptItem, i) => (
          <motion.div key={i} variants={item} className="flex justify-between text-sm py-1 text-smoke">
            <span>
              {receiptItem.quantity} × {receiptItem.name}
            </span>
            <span className="text-linen">{(receiptItem.price * receiptItem.quantity).toFixed(2)} TND</span>
          </motion.div>
        ))}
      </motion.div>

      <div className="border-t border-dashed border-gold/20 mt-4 pt-4 flex justify-between font-display font-semibold">
        <span className="text-linen">Total</span>
        <span className="text-gold">{total.toFixed(2)} TND</span>
      </div>

      <p className="text-center text-xs text-smoke mt-6">Thank you for dining with us!</p>
    </motion.div>
  );
}