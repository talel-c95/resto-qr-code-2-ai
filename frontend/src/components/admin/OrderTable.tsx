import { motion } from "framer-motion";
import { Receipt as ReceiptIcon } from "lucide-react";
import { AdminOrder, OrderStatus } from "@/types/order.types";

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "served",
  "completed",
  "cancelled",
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "text-smoke",
  accepted: "text-gold",
  preparing: "text-gold",
  ready: "text-lime",
  served: "text-lime",
  completed: "text-smoke",
  cancelled: "text-rust",
};

interface OrderTableProps {
  orders: AdminOrder[];
  onStatusChange: (id: string, status: OrderStatus) => void;
  onViewReceipt: (orderId: string) => void;
}

export function OrderTable({ orders, onStatusChange, onViewReceipt }: OrderTableProps) {
  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <motion.div
          key={order.id}
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-charcoal border border-gold/20 rounded-lg p-4 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-linen font-medium">Table {order.tableId}</span>
              <span className="text-smoke text-xs ml-2">
                {new Date(order.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {(order.status === "served" || order.status === "completed") && (
                <button
                  onClick={() => onViewReceipt(order.id)}
                  title="View receipt"
                  className="text-smoke hover:text-gold transition-colors"
                >
                  <ReceiptIcon size={18} />
                </button>
              )}
              <select
                value={order.status}
                onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                className={`bg-noir border border-gold/20 rounded-lg px-3 py-1 text-sm font-mono uppercase focus:outline-none focus:border-gold ${STATUS_COLORS[order.status]}`}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-smoke text-sm">
            {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ") || "No items"}
          </div>
          <div className="text-gold font-semibold">{order.total.toFixed(2)} TND</div>
        </motion.div>
      ))}
    </div>
  );
}