import { DollarSign, ShoppingBag, TrendingUp, Calendar } from "lucide-react";
import { useAdminRevenue } from "@/hooks/useAdminRevenue";
import { StatsCard } from "@/components/admin/StatsCard";
import { RevenueChart } from "@/components/admin/RevenueChart";

export default function RevenuePage() {
  const { summary, loading, error } = useAdminRevenue();

  return (
    <div className="min-h-screen bg-noir px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-linen mb-6">Revenue</h1>

      {error && <p className="text-rust text-sm mb-4">{error}</p>}

      {loading || !summary ? (
        <p className="text-smoke">Loading revenue data...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard label="Total Revenue" value={`${summary.totalRevenue.toFixed(2)} TND`} icon={DollarSign} />
            <StatsCard label="Today" value={`${summary.todayRevenue.toFixed(2)} TND`} icon={Calendar} />
            <StatsCard label="Completed Orders" value={summary.orderCount.toString()} icon={ShoppingBag} />
            <StatsCard
              label="Avg. Order Value"
              value={`${summary.averageOrderValue.toFixed(2)} TND`}
              icon={TrendingUp}
            />
          </div>

          <h2 className="font-mono text-xs uppercase text-smoke mb-3">Last 7 Days</h2>
          <div className="mb-6">
            <RevenueChart data={summary.dailyRevenue} />
          </div>

          <h2 className="font-mono text-xs uppercase text-smoke mb-3">Top Selling Items</h2>
          <div className="flex flex-col gap-2">
            {summary.topItems.length === 0 ? (
              <p className="text-smoke text-sm">No completed orders yet.</p>
            ) : (
              summary.topItems.map((item, i) => (
                <div
                  key={item.name}
                  className="bg-charcoal border border-gold/20 rounded-lg p-3 flex items-center justify-between"
                >
                  <span className="text-linen">
                    <span className="text-gold font-mono mr-2">#{i + 1}</span>
                    {item.name}
                  </span>
                  <span className="text-smoke text-sm">
                    {item.quantity} sold · {item.revenue.toFixed(2)} TND
                  </span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}