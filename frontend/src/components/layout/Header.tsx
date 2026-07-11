import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { items } = useCart();

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const tableId = sessionStorage.getItem("tableId");

  const handleMenuClick = () => {
    if (tableId) {
      navigate(`/menu/${tableId}`);
    } else {
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <button
        onClick={() => navigate("/")}
        className="font-bold text-lg text-gray-900"
      >
        Resto QR
      </button>

      <nav className="flex items-center gap-5 text-sm font-medium text-gray-600">
        <button onClick={handleMenuClick} className="hover:text-black">
          Menu
        </button>

        <button onClick={() => navigate("/cart")} className="relative hover:text-black">
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        {isAuthenticated ? (
          <>
            <button onClick={() => navigate("/history")} className="hover:text-black">
              Orders
            </button>
            <button onClick={logout} className="hover:text-black text-gray-400">
              Log out
            </button>
          </>
        ) : (
          <button onClick={() => navigate("/login")} className="hover:text-black">
            Log in
          </button>
        )}
      </nav>
    </header>
  );
}