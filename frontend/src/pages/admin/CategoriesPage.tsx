import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useAdminCategories } from "@/hooks/useAdminCategories";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { Category } from "@/types/menu.types";

export default function CategoriesPage() {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useAdminCategories();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setShowForm(true);
  };

  const handleSubmit = async (data: { name: string }) => {
    if (editing) {
      await updateCategory(editing.id, data);
    } else {
      await createCategory(data);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    setDeletingId(id);
    try {
      await deleteCategory(id);
    } catch (err: any) {
      setDeleteError(err?.response?.data?.message || "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-noir px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-linen">Categories</h1>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          className="bg-gold text-noir px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          <Plus size={18} /> New Category
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="mb-6">
            <CategoryForm
              initial={editing}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
            />
          </div>
        )}
      </AnimatePresence>

      {error && <p className="text-rust text-sm mb-4">{error}</p>}
      {deleteError && <p className="text-rust text-sm mb-4">{deleteError}</p>}

      {loading ? (
        <p className="text-smoke">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="text-smoke">No categories yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-charcoal border border-gold/20 rounded-lg p-4 flex items-center justify-between"
            >
              <span className="text-linen font-medium">{cat.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(cat)}
                  className="text-smoke hover:text-gold transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  disabled={deletingId === cat.id}
                  className="text-smoke hover:text-rust transition-colors disabled:opacity-50"
                >
                  {deletingId === cat.id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}