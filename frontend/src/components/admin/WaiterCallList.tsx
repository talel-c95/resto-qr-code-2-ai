import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check } from "lucide-react";
import { WaiterCall } from "@/types/waiterCall.types";

interface WaiterCallListProps {
  calls: WaiterCall[];
  onResolve: (id: string) => void;
}

export function WaiterCallList({ calls, onResolve }: WaiterCallListProps) {
  const pending = calls.filter((c) => c.status === "pending");
  const resolved = calls.filter((c) => c.status === "resolved");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-mono text-xs uppercase text-smoke mb-3">Pending ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="text-smoke text-sm">No pending calls.</p>
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {pending.map((call) => (
                <motion.div
                  key={call.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="bg-gold/10 border border-gold/30 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="text-gold"
                    >
                      <Bell size={20} />
                    </motion.div>
                    <div>
                      <p className="text-linen font-medium">Table {call.tableId}</p>
                      <p className="text-xs text-smoke">{new Date(call.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onResolve(call.id)}
                    className="bg-gold text-noir px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                  >
                    <Check size={16} /> Resolve
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {resolved.length > 0 && (
        <div>
          <h2 className="font-mono text-xs uppercase text-smoke mb-3">Resolved ({resolved.length})</h2>
          <div className="flex flex-col gap-2">
            {resolved.map((call) => (
              <div
                key={call.id}
                className="bg-charcoal border border-gold/10 rounded-lg p-4 flex items-center justify-between opacity-60"
              >
                <p className="text-smoke">Table {call.tableId}</p>
                <span className="text-xs text-smoke font-mono uppercase">Resolved</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}