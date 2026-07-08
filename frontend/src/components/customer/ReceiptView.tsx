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

export function ReceiptView({ orderId, tableId, items, total, createdAt }: ReceiptViewProps) {
  return (
    <div className="bg-white rounded-xl p-6 max-w-sm mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">Receipt</h2>
        <p className="text-xs text-gray-400">Order #{orderId}</p>
        <p className="text-xs text-gray-400">Table {tableId}</p>
        <p className="text-xs text-gray-400">{new Date(createdAt).toLocaleString()}</p>
      </div>

      <div className="border-t border-dashed border-gray-300 pt-4">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm py-1">
            <span>
              {item.quantity} × {item.name}
            </span>
            <span>{(item.price * item.quantity).toFixed(2)} TND</span>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-gray-300 mt-4 pt-4 flex justify-between font-bold">
        <span>Total</span>
        <span>{total.toFixed(2)} TND</span>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">Thank you for dining with us!</p>
    </div>
  );
}