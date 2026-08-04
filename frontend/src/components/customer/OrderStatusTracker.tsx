import { motion, type Variants } from "framer-motion";
import { OrderStatus } from "@/types/order.types";

interface OrderStatusTrackerProps {
  status: OrderStatus;
}

const steps: { key: OrderStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "served", label: "Served" },
  { key: "completed", label: "Completed" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  const currentIndex = steps.findIndex((s) => s.key === status);

  if (status === "cancelled") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-rust/10 border border-rust/30 rounded-xl p-6 text-center"
      >
        <p className="text-rust font-semibold">This order was cancelled.</p>
      </motion.div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4">
      {steps.map((step, index) => {
        const isDone = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <motion.div key={step.key} Variants={item} className="flex items-center gap-3">
            <motion.div
              animate={isActive ? { scale: [1, 1.15, 1] } : {}}
              transition={isActive ? { repeat: Infinity, duration: 1.6, ease: "easeInOut" } : {}}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                isDone
                  ? "bg-gold text-noir"
                  : isActive
                  ? "bg-gold text-noir ring-4 ring-gold/20"
                  : "bg-charcoal border border-smoke/30 text-smoke"
              }`}
            >
              {isDone ? "✓" : index + 1}
            </motion.div>
            <span
              className={`font-medium ${
                isActive ? "text-linen" : isDone ? "text-smoke" : "text-smoke/50"
              }`}
            >
              {step.label}
            </span>
            {isActive && (
              <span className="text-xs text-gold ml-auto animate-pulse">in progress...</span>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}