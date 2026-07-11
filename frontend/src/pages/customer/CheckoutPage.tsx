import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useOrder } from "@/hooks/useOrder";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { submitOrder, loading, error } = useOrder();
  const navigate = useNavigate();
  const { tableId } = useParams<{ tableId: string }>();

  // Fallback: table id might come from cart flow, not URL, so check sessionStorage as backup
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
      // Mock fallback since there's no backend yet — simulate a fake order id
      clearCart();
      navigate(`/orders/mock-order-1`);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">Nothing to Checkout</h1>
        <p className="text-gray-500 mb-6">Your cart is empty.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-6 py-3 rounded-lg font-medium"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="bg-white rounded-xl p-4 mb-6">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        {items.map((item) => (
          <div key={item.menuItemId} className="flex justify-between py-2 text-sm">
            <span>
              {item.quantity} × {item.name}
            </span>
            <span>{(item.price * item.quantity).toFixed(2)} TND</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-gray-200 mt-3 pt-3 font-bold">
          <span>Total</span>
          <span>{total.toFixed(2)} TND</span>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={handleConfirm}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
      >
        {loading ? "Placing order..." : "Confirm Order"}
      </button>
    </div>
  );
}