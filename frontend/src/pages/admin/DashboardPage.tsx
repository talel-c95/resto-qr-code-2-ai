import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Tag,
  UtensilsCrossed,
  QrCode,
  ClipboardList,
  Bell,
  DollarSign,
  Sparkles,
  DollarSign as DollarIcon,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminRevenue } from "@/hooks/useAdminRevenue";
import { StatsCard } from "@/components/admin/StatsCard";

const SHORTCUTS = [
  { to: "/admin/categories", label: "Categories", icon: Tag, desc: "Manage menu categories" },
  { to: "/admin/menu", label: "Menu", icon: UtensilsCrossed, desc: "Add, edit, and remove dishes" },
  { to: "/admin/tables", label: "Tables", icon: QrCode, desc: "Manage tables and QR codes" },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList, desc: "Live orders and status" },
  { to: "/admin/waiter-calls", label: "Waiter Calls", icon: Bell, desc: "Live waiter call requests" },
  { to: "/admin/revenue", label: "Revenue", icon: DollarSign, desc: "Sales and top items" },
  { to: "/admin/ai-analytics", label: "AI Analytics", icon: Sparkles, desc: "AI-generated insights" },
];

export default function DashboardPage() {
  const { admin } = useAdminAuth();
  const { summary, loading } = useAdminRevenue();

  return (
    <div className="min-h-screen bg-noir px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-linen mb-1">
        Welcome{admin?.name ? `, ${admin.name}` : ""}
      </h1>
      <p className="text-smoke text-sm mb-6">Here's what's happening at your restaurant.</p>

      {!loading && summary && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatsCard label="Total Revenue" value={`${summary.totalRevenue.toFixed(2)} TND`} icon={DollarIcon} />
          <StatsCard label="Completed Orders" value={summary.orderCount.toString()} icon={ShoppingBag} />
          <StatsCard
            label="Avg. Order Value"
            value={`${summary.averageOrderValue.toFixed(2)} TND`}
            icon={TrendingUp}
          />
        </div>
      )}

      <h2 className="font-mono text-xs uppercase text-smoke mb-3">Manage</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SHORTCUTS.map(({ to, label, icon: Icon, desc }, i) => (
          <motion.div key={to} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Link
              to={to}
              className="block bg-charcoal border border-gold/20 rounded-lg p-4 hover:border-gold transition-colors h-full"
            >
              <div className="bg-gold/10 text-gold rounded-lg p-2 w-fit mb-3">
                <Icon size={20} />
              </div>
              <p className="text-linen font-medium mb-1">{label}</p>
              <p className="text-smoke text-sm">{desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}