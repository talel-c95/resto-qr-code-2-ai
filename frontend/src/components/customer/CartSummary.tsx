interface CartSummaryProps {
  total: number;
  onCheckout: () => void;
  disabled?: boolean;
}

export function CartSummary({ total, onCheckout, disabled }: CartSummaryProps) {
  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-500">Total</span>
        <span className="text-xl font-bold text-gray-900">{total.toFixed(2)} TND</span>
      </div>
      <button
        onClick={onCheckout}
        disabled={disabled}
        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-40"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}