import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Category } from "@/types/menu.types";

interface CategoryFormProps {
  initial?: Category | null;
  onSubmit: (data: { name: string }) => Promise<void>;
  onCancel: () => void;
}

export function CategoryForm({ initial, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(initial?.name ?? "");
  }, [initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ name });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-charcoal border border-gold/20 rounded-lg p-4 flex flex-col gap-3"
    >
      <input
        type="text"
        placeholder="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-noir border border-gold/20 text-linen placeholder-smoke rounded-lg px-4 py-2 focus:outline-none focus:border-gold transition-colors"
        required
      />
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
          disabled={submitting}
          className="bg-gold text-noir px-4 py-2 rounded-lg font-semibold hover:brightness-110 transition-colors disabled:opacity-60"
        >
          {submitting ? "Saving..." : initial ? "Update" : "Create"}
        </button>
      </div>
    </motion.form>
  );
}