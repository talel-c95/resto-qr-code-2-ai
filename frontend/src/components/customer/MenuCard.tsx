import { MenuItem } from "@/types/menu.types";
import { DynamicMenuBadge } from "./DynamicMenuBadge";

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export function MenuCard({ item, onAddToCart }: MenuCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col bg-white">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-36 object-cover"
          loading="lazy"
        />
      )}

      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          <span className="font-medium text-gray-900 whitespace-nowrap">
            {item.price.toFixed(2)} TND
          </span>
        </div>

        <p className="text-sm text-gray-500">{item.description}</p>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {item.tags.map((tag) => (
              <DynamicMenuBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        <button
          onClick={() => onAddToCart(item)}
          className="mt-2 bg-black text-white text-sm py-2 rounded-lg font-medium hover:bg-gray-800 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}