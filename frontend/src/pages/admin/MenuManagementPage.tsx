import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useAdminMenuItems } from "@/hooks/useAdminMenuItems";
import { useAdminCategories } from "@/hooks/useAdminCategories";
import { MenuForm } from "@/components/admin/MenuForm";
import { MenuItem } from "@/types/menu.types";

export default function MenuManagementPage() {
  const { items, loading, error, createMenuItem, updateMenuItem, deleteMenuItem } = useAdminMenuItems();
  const { categories, loading: categoriesLoading } = useAdminCategories();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const categoryNameById = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories]
  );

  const filteredItems = useMemo(
    () => (activeCategoryId ? items.filter((i) => i.categoryId === activeCategoryId) : items),
    [items, activeCategoryId]
  );

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setShowForm(true);
  };

  const handleSubmit = async (data: Omit<MenuItem, "id">) => {
    if (editing) {
      await updateMenuItem(editing.id, data);
    } else {
      await createMenuItem(data);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    setDeletingId(id);
    try {
      await deleteMenuItem(id);
    } catch (err: any) {
      setDeleteError(err?.response?.data?.message || "Failed to delete menu item");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-noir px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-linen">Menu Items</h1>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          disabled={categories.length === 0}
          className="bg-gold text-noir px-4 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50"
        >
          <Plus size={18} /> New Item
        </motion.button>
      </div>

      {categories.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveCategoryId(null)}
            className={`text-xs font-mono uppercase px-3 py-1 rounded-full border transition-colors ${
              activeCategoryId === null
                ? "bg-gold text-noir border-gold"
                : "bg-charcoal text-smoke border-gold/20 hover:border-gold/50"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`text-xs font-mono uppercase px-3 py-1 rounded-full border transition-colors ${
                activeCategoryId === cat.id
                  ? "bg-gold text-noir border-gold"
                  : "bg-charcoal text-smoke border-gold/20 hover:border-gold/50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && !categoriesLoading && (
          <div className="mb-6">
            <MenuForm
              initial={editing}
              categories={categories}
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
      {categories.length === 0 && !categoriesLoading && (
        <p className="text-gold text-sm mb-4">Create a category first before adding menu items.</p>
      )}

      {loading ? (
        <p className="text-smoke">Loading menu items...</p>
      ) : filteredItems.length === 0 ? (
        <p className="text-smoke">No menu items yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-charcoal border border-gold/20 rounded-lg p-4 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-linen font-medium">{item.name}</p>
                  <p className="text-xs text-smoke font-mono uppercase mt-1">
                    {categoryNameById.get(item.categoryId) ?? "Uncategorized"}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(item)}
                    className="text-smoke hover:text-gold transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="text-smoke hover:text-rust transition-colors disabled:opacity-50"
                  >
                    {deletingId === item.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-smoke text-sm">{item.description}</p>
              <p className="text-gold font-semibold">{item.price.toFixed(2)} TND</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}