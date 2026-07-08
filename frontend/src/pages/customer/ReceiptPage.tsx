import { useParams, useNavigate } from "react-router-dom";
import { ReceiptView } from "@/components/customer/ReceiptView";

export default function ReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data — will be replaced by a real GET /api/orders/:id + order items call
  const mockReceipt = {
    tableId: "5",
    items: [
      { name: "Brik à l'oeuf", quantity: 1, price: 6.5 },
      { name: "Couscous Royal", quantity: 1, price: 18 },
      { name: "Makroudh", quantity: 1, price: 4 },
    ],
    total: 28.5,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <ReceiptView
        orderId={id ?? "unknown"}
        tableId={mockReceipt.tableId}
        items={mockReceipt.items}
        total={mockReceipt.total}
        createdAt={mockReceipt.createdAt}
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