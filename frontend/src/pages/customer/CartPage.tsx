import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/components/customer/CartItem";
import { CartSummary } from "@/components/customer/CartSummary";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-6">Add some items from the menu to get started.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-black text-white px-6 py-3 rounded-lg font-medium"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

      <div className="bg-white rounded-xl p-4">
        {items.map((item) => (
          <CartItem
            key={item.menuItemId}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}

        <CartSummary total={total} onCheckout={() => navigate("/checkout")} />
      </div>
    </div>
  );
}