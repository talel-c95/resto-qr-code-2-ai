import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { OrderTable } from "@/components/admin/OrderTable";
import { ReceiptView } from "@/components/customer/ReceiptView";
import * as receiptService from "@/services/receiptService";
import { ReceiptData } from "@/services/receiptService";

export default function OrdersPage() {
  const { orders, loading, error, updateStatus } = useAdminOrders();
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [receiptError, setReceiptError] = useState<string | null>(null);

  const handleViewReceipt = async (orderId: string) => {
    setReceiptError(null);
    try {
      const data = await receiptService.getReceipt(orderId);
      setReceipt(data);
    } catch {
      setReceiptError("Failed to load receipt");
    }
  };

  return (
    <div className="min-h-screen bg-noir px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-linen mb-6">Orders</h1>

      {error && <p className="text-rust text-sm mb-4">{error}</p>}
      {receiptError && <p className="text-rust text-sm mb-4">{receiptError}</p>}

      {loading ? (
        <p className="text-smoke">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-smoke">No orders yet.</p>
      ) : (
        <OrderTable orders={orders} onStatusChange={updateStatus} onViewReceipt={handleViewReceipt} />
      )}

      <AnimatePresence>
        {receipt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReceipt(null)}
            className="fixed inset-0 bg-noir/80 flex items-center justify-center z-50 px-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm"
            >
              <button
                onClick={() => setReceipt(null)}
                className="absolute -top-3 -right-3 bg-charcoal border border-gold/20 rounded-full p-1 text-smoke hover:text-linen transition-colors z-10"
              >
                <X size={16} />
              </button>
              <ReceiptView
                orderId={receipt.orderId}
                tableId={receipt.tableId}
                items={receipt.items}
                total={receipt.total}
                createdAt={receipt.createdAt}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}