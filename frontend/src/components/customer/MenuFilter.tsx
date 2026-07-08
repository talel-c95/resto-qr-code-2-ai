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
      <input
        type="text"
        placeholder="Search menu..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
            activeCategoryId === null
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              activeCategoryId === cat.id
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}