import { useState } from "react";
import { motion } from "framer-motion";

interface TableFormProps {
  onSubmit: (data: { number: number; capacity?: number }) => Promise<void>;
  onCancel: () => void;
}

export function TableForm({ onSubmit, onCancel }: TableFormProps) {
  const [number, setNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "bg-noir border border-gold/20 text-linen placeholder-smoke rounded-lg px-4 py-2 focus:outline-none focus:border-gold transition-colors w-full";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        number: parseInt(number, 10),
        capacity: capacity ? parseInt(capacity, 10) : undefined,
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save table");
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
      <div className="flex gap-3">
        <input
          type="number"
          min="1"
          placeholder="Table number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className={inputClass}
          required
        />
        <input
          type="number"
          min="1"
          placeholder="Capacity (optional)"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className={inputClass}
        />
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
          disabled={submitting}
          className="bg-gold text-noir px-4 py-2 rounded-lg font-semibold hover:brightness-110 transition-colors disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Create"}
        </button>
      </div>
    </motion.form>
  );
}