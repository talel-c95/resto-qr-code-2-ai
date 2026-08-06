import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MenuItem, Category } from "@/types/menu.types";

interface MenuFormProps {
  initial?: MenuItem | null;
  categories: Category[];
  onSubmit: (data: Omit<MenuItem, "id">) => Promise<void>;
  onCancel: () => void;
}

export function MenuForm({ initial, categories, onSubmit, onCancel }: MenuFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [isVegetarian, setIsVegetarian] = useState(initial?.isVegetarian ?? false);
  const [isVegan, setIsVegan] = useState(initial?.isVegan ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(initial?.name ?? "");
    setDescription(initial?.description ?? "");
    setPrice(initial?.price?.toString() ?? "");
    setCategoryId(initial?.categoryId ?? categories[0]?.id ?? "");
    setImageUrl(initial?.imageUrl ?? "");
    setIsVegetarian(initial?.isVegetarian ?? false);
    setIsVegan(initial?.isVegan ?? false);
  }, [initial, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        name,
        description,
        price: parseFloat(price),
        categoryId,
        imageUrl: imageUrl || undefined,
        isVegetarian,
        isVegan,
        allergens: initial?.allergens ?? [],
        tags: initial?.tags ?? [],
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save menu item");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "bg-noir border border-gold/20 text-linen placeholder-smoke rounded-lg px-4 py-2 focus:outline-none focus:border-gold transition-colors w-full";

  return (
    <motion.form
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-charcoal border border-gold/20 rounded-lg p-4 flex flex-col gap-3"
    >
      <input
        type="text"
        placeholder="Dish name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputClass}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={inputClass}
        rows={2}
        required
      />
      <div className="flex gap-3">
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={inputClass}
          required
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={inputClass}
          required
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <input
        type="text"
        placeholder="Image URL (optional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className={inputClass}
      />
      <div className="flex gap-4 text-sm text-smoke">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isVegetarian}
            onChange={(e) => setIsVegetarian(e.target.checked)}
          />
          Vegetarian
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isVegan} onChange={(e) => setIsVegan(e.target.checked)} />
          Vegan
        </label>
      </div>

      {error && <p className="text-rust text-sm">{error}</p>}

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-smoke hover:text-linen transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || categories.length === 0}
          className="bg-gold text-noir px-4 py-2 rounded-lg font-semibold hover:brightness-110 transition-colors disabled:opacity-60"
        >
          {submitting ? "Saving..." : initial ? "Update" : "Create"}
        </button>
      </div>
    </motion.form>
  );
}