import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Tag,
  UtensilsCrossed,
  QrCode,
  ClipboardList,
  Bell,
  DollarSign,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/admin/tables", label: "Tables", icon: QrCode },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/waiter-calls", label: "Waiter Calls", icon: Bell },
  { to: "/admin/revenue", label: "Revenue", icon: DollarSign },
  { to: "/admin/ai-analytics", label: "AI Analytics", icon: Sparkles },
];

export function Sidebar() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <aside className="w-60 shrink-0 bg-charcoal border-r border-gold/10 min-h-screen flex flex-col px-3 py-6">
      <div className="px-3 mb-8">
        <h1 className="font-display text-lg text-linen font-semibold">Resto QR</h1>
        <p className="text-xs text-smoke font-mono uppercase">Admin</p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive ? "bg-gold text-noir font-semibold" : "text-smoke hover:text-linen hover:bg-noir"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gold/10 pt-4 px-3">
        {admin && <p className="text-xs text-smoke mb-2 truncate">{admin.email}</p>}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-smoke hover:text-rust transition-colors text-sm"
        >
          <LogOut size={16} /> Log out
        </motion.button>
      </div>
    </aside>
  );
}