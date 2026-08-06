import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, QrCode, Loader2 } from "lucide-react";
import { useAdminTables } from "@/hooks/useAdminTables";
import { TableForm } from "@/components/admin/TableForm";
import { QRCodeDisplay } from "@/components/admin/QRCodeDisplay";
import * as adminTableService from "@/services/adminTableService";

export default function TablesPage() {
  const { tables, loading, error, createTable, deleteTable } = useAdminTables();
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [qrLoadingId, setQrLoadingId] = useState<string | null>(null);
  const [qrData, setQrData] = useState<{ qrCode: string; tableNumber: number } | null>(null);

  const handleCreate = async (data: { number: number; capacity?: number }) => {
    await createTable(data);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    setDeletingId(id);
    try {
      await deleteTable(id);
    } catch (err: any) {
      setDeleteError(err?.response?.data?.message || "Failed to delete table");
    } finally {
      setDeletingId(null);
    }
  };

  const handleShowQr = async (id: string) => {
    setQrLoadingId(id);
    try {
      const data = await adminTableService.getTableQrCode(id);
      setQrData(data);
    } catch {
      setDeleteError("Failed to generate QR code");
    } finally {
      setQrLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-noir px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-linen">Tables</h1>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm((v) => !v)}
          className="bg-gold text-noir px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          <Plus size={18} /> New Table
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="mb-6">
            <TableForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          </div>
        )}
      </AnimatePresence>

      {error && <p className="text-rust text-sm mb-4">{error}</p>}
      {deleteError && <p className="text-rust text-sm mb-4">{deleteError}</p>}

      {loading ? (
        <p className="text-smoke">Loading tables...</p>
      ) : tables.length === 0 ? (
        <p className="text-smoke">No tables yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <motion.div
              key={table.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-charcoal border border-gold/20 rounded-lg p-4 flex flex-col items-center gap-3"
            >
              <span className="font-display text-2xl text-linen">Table {table.number}</span>
              {table.capacity && <span className="text-xs text-smoke">Seats {table.capacity}</span>}
              <div className="flex gap-2 w-full">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleShowQr(table.id)}
                  disabled={qrLoadingId === table.id}
                  className="flex-1 bg-noir border border-gold/20 text-gold px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 hover:border-gold transition-colors disabled:opacity-50"
                >
                  {qrLoadingId === table.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <QrCode size={16} />
                  )}
                  QR
                </motion.button>
                <button
                  onClick={() => handleDelete(table.id)}
                  disabled={deletingId === table.id}
                  className="text-smoke hover:text-rust transition-colors disabled:opacity-50 px-2"
                >
                  {deletingId === table.id ? (
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

      <AnimatePresence>
        {qrData && (
          <QRCodeDisplay
            qrCode={qrData.qrCode}
            tableNumber={qrData.tableNumber}
            onClose={() => setQrData(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}