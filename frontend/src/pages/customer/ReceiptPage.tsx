import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReceiptView } from "@/components/customer/ReceiptView";
import * as receiptService from "@/services/receiptService";
import { ReceiptData } from "@/services/receiptService";

const mockReceipt: ReceiptData = {
  orderId: "unknown",
  tableId: "5",
  items: [
    { name: "Brik à l'oeuf", quantity: 1, price: 6.5 },
    { name: "Couscous Royal", quantity: 1, price: 18 },
    { name: "Makroudh", quantity: 1, price: 4 },
  ],
  total: 28.5,
  createdAt: new Date().toISOString(),
};

export default function ReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    async function load() {
      try {
        const data = await receiptService.getReceipt(id!);
        if (isMounted) {
          setReceipt(data);
          setUsingMockData(false);
        }
      } catch {
        if (isMounted) {
          setReceipt({ ...mockReceipt, orderId: id! });
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
  }, [id]);

  if (loading || !receipt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading receipt...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      {usingMockData && (
        <p className="text-xs text-orange-500 text-center mb-4">
          Showing sample receipt — could not load real order
        </p>
      )}

      <ReceiptView
        orderId={receipt.orderId}
        tableId={receipt.tableId}
        items={receipt.items}
        total={receipt.total}
        createdAt={receipt.createdAt}
      />

      <button
        onClick={() => navigate("/")}
        className="w-full max-w-sm mx-auto block mt-6 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
      >
        Back to Home
      </button>
    </div>
  );
}