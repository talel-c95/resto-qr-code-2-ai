import { motion } from "framer-motion";
import { MenuItem } from "@/types/menu.types";
import { DynamicMenuBadge } from "./DynamicMenuBadge";

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export function MenuCard({ item, onAddToCart }: MenuCardProps) {
  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="border border-gold/10 bg-charcoal rounded-xl overflow-hidden flex flex-col transition-shadow hover:shadow-lg hover:shadow-gold/10"
    >
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
          <h3 className="font-medium text-linen">{item.name}</h3>
          <span className="font-medium text-gold whitespace-nowrap">
            {item.price.toFixed(2)} TND
          </span>
        </div>

        <p className="text-sm text-smoke">{item.description}</p>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {item.tags.map((tag) => (
              <DynamicMenuBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAddToCart(item)}
          className="mt-2 bg-gold text-noir text-sm py-2 rounded-lg font-medium hover:brightness-110 transition-colors"
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}