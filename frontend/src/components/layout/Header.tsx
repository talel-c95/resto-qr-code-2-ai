import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, ShoppingCart, Receipt, LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { items } = useCart();

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const tableId = sessionStorage.getItem("tableId");

  const handleMenuClick = () => {
    navigate(tableId ? `/menu/${tableId}` : "/");
  };

  return (
    <header className="sticky top-0 z-40 bg-noir/90 backdrop-blur-md text-linen px-4 sm:px-6 py-3 flex items-center justify-between border-b border-gold/20">
      <motion.button
        onClick={() => navigate("/")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="font-display text-lg sm:text-xl font-semibold text-gold shrink-0"
      >
        Resto AI
      </motion.button>

      <nav className="flex items-center gap-3 sm:gap-5 text-sm font-medium">
        <motion.button
          onClick={handleMenuClick}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 min-w-[44px] min-h-[44px] justify-center text-smoke hover:text-gold transition-colors"
        >
          <Utensils size={20} strokeWidth={1.75} />
          <span className="hidden sm:inline">Menu</span>
        </motion.button>

        <motion.button
          onClick={() => navigate("/cart")}
          whileTap={{ scale: 0.9 }}
          className="relative flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 min-w-[44px] min-h-[44px] justify-center text-smoke hover:text-gold transition-colors"
        >
          <ShoppingCart size={20} strokeWidth={1.75} />
          <span className="hidden sm:inline">Cart</span>
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="absolute -top-1 right-1 sm:right-auto sm:-top-2 sm:-right-3 bg-rust text-linen text-[10px] font-mono rounded-full w-4 h-4 flex items-center justify-center"
              >
                {cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {isAuthenticated ? (
          <>
            <motion.button
              onClick={() => navigate("/history")}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 min-w-[44px] min-h-[44px] justify-center text-smoke hover:text-gold transition-colors"
            >
              <Receipt size={20} strokeWidth={1.75} />
              <span className="hidden sm:inline">Orders</span>
            </motion.button>
            <motion.button
              onClick={logout}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 min-w-[44px] min-h-[44px] justify-center text-smoke/60 hover:text-rust transition-colors"
            >
              <LogOut size={20} strokeWidth={1.75} />
              <span className="hidden sm:inline">Log out</span>
            </motion.button>
          </>
        ) : (
          <motion.button
            onClick={() => navigate("/login")}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 min-w-[44px] min-h-[44px] justify-center text-smoke hover:text-gold transition-colors"
          >
            <UserRound size={20} strokeWidth={1.75} />
            <span className="hidden sm:inline">Log in</span>
          </motion.button>
        )}
      </nav>
    </header>
  );
}