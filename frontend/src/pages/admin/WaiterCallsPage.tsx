import { useAdminWaiterCalls } from "@/hooks/useAdminWaiterCalls";
import { WaiterCallList } from "@/components/admin/WaiterCallList";

export default function WaiterCallsPage() {
  const { calls, loading, error, resolveCall } = useAdminWaiterCalls();

  return (
    <div className="min-h-screen bg-noir px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-linen mb-6">Waiter Calls</h1>

      {error && <p className="text-rust text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-smoke">Loading waiter calls...</p>
      ) : calls.length === 0 ? (
        <p className="text-smoke">No waiter calls yet.</p>
      ) : (
        <WaiterCallList calls={calls} onResolve={resolveCall} />
      )}
    </div>
  );
}