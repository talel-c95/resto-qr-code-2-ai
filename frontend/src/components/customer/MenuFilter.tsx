import { motion } from "framer-motion";
import { Category } from "@/types/menu.types";

interface MenuFilterProps {
  categories: Category[];
  activeCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function MenuFilter({
  categories,
  activeCategoryId,
  onSelectCategory,
  searchTerm,
  onSearchChange,
}: MenuFilterProps) {
  return (
    <div className="flex flex-col gap-3 mb-4">
      <motion.input
        whileFocus={{ scale: 1.01, borderColor: "#FF8A3D" }}
        type="text"
        placeholder="Search menu..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="bg-charcoal border border-gold/20 text-linen placeholder-smoke rounded-lg px-4 py-2 w-full focus:outline-none transition-colors"
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeCategoryId === null
              ? "bg-gold text-noir"
              : "bg-charcoal text-smoke border border-gold/10"
          }`}
        >
          All
        </motion.button>
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategoryId === cat.id
                ? "bg-gold text-noir"
                : "bg-charcoal text-smoke border border-gold/10"
            }`}
          >
            {cat.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
}