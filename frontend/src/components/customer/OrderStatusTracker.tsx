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

export function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  const currentIndex = steps.findIndex((s) => s.key === status);

  if (status === "cancelled") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 font-semibold">This order was cancelled.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {steps.map((step, index) => {
        const isDone = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={step.key} className="flex items-center gap-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                isDone
                  ? "bg-black text-white"
                  : isActive
                  ? "bg-black text-white ring-4 ring-gray-200"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {isDone ? "✓" : index + 1}
            </div>
            <span
              className={`font-medium ${
                isActive ? "text-gray-900" : isDone ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
            {isActive && (
              <span className="text-xs text-gray-400 ml-auto animate-pulse">in progress...</span>
            )}
          </div>
        );
      })}
    </div>
  );
}