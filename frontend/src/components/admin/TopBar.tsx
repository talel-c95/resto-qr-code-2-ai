import { useLocation } from "react-router-dom";
import { useSocket } from "@/hooks/useSocket";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/categories": "Categories",
  "/admin/menu": "Menu Management",
  "/admin/tables": "Tables",
  "/admin/orders": "Orders",
  "/admin/waiter-calls": "Waiter Calls",
  "/admin/revenue": "Revenue",
  "/admin/ai-analytics": "AI Restaurant Analytics",
};

export function TopBar() {
  const location = useLocation();
  const { connected } = useSocket();
  const title = PAGE_TITLES[location.pathname] ?? "Admin";

  return (
    <header className="h-14 border-b border-gold/10 flex items-center justify-between px-6 bg-noir sticky top-0 z-10">
      <span className="text-smoke text-sm font-mono uppercase">{title}</span>
      <span
        className={`text-xs font-mono uppercase px-3 py-1 rounded-full border ${
          connected ? "text-lime border-lime/40" : "text-rust border-rust/40"
        }`}
      >
        {connected ? "Live" : "Offline"}
      </span>
    </header>
  );
}