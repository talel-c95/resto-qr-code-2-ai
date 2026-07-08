import { CartItemWithMeta } from "@/context/CartContext";

interface CartItemProps {
  item: CartItemWithMeta;
  onUpdateQuantity: (menuItemId: string, quantity: number) => void;
  onRemove: (menuItemId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-4">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.price.toFixed(2)} TND each</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onUpdateQuantity(item.menuItemId, item.quantity - 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100"
        >
          −
        </button>
        <span className="w-6 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.menuItemId, item.quantity + 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100"
        >
          +
        </button>
      </div>

      <div className="w-20 text-right font-medium text-gray-900">
        {(item.price * item.quantity).toFixed(2)} TND
      </div>

      <button
        onClick={() => onRemove(item.menuItemId)}
        className="ml-4 text-gray-400 hover:text-red-500 text-sm"
      >
        Remove
      </button>
    </div>
  );
}