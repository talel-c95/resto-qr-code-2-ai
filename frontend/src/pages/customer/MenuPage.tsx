import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMenu } from "@/hooks/useMenu";
import { useCart } from "@/hooks/useCart";
import { useMenuRecommendations } from "@/hooks/useMenuRecommendations";
import { MenuFilter } from "@/components/customer/MenuFilter";
import { MenuCard } from "@/components/customer/MenuCard";
import { MenuItem } from "@/types/menu.types";
import { WaiterCallButton } from "@/components/customer/WaiterCallButton";
import { AIChatBox } from "@/components/customer/AIChatBox";
import { useMenuTranslation } from "@/hooks/useMenuTranslation";
export default function MenuPage() {
  const { tableId } = useParams<{ tableId: string }>();
  useEffect(() => {
    if (tableId) {
      sessionStorage.setItem("tableId", tableId);
    }
  }, [tableId]);
  const navigate = useNavigate();
  const { items, categories, loading, usingMockData } = useMenu(tableId);
  const { recommendations } = useMenuRecommendations();
  const { items: cartItems, addItem, total } = useCart();

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const recommendedIds = useMemo(
    () => new Set(recommendations.map((r) => r.menuItemId)),
    [recommendations]
  );

  const itemsWithAiTags = useMemo(() => {
    return items.map((item) =>
      recommendedIds.has(item.id)
        ? { ...item, tags: [...(item.tags ?? []), "ai-recommended"] }
        : item
    );
  }, [items, recommendedIds]);
  const { language, setLanguage, translatedItems, loading: translating } = useMenuTranslation(itemsWithAiTags);
  const filteredItems = useMemo(() => {
  return translatedItems.filter((item) => {
    const matchesCategory = activeCategoryId ? item.categoryId === activeCategoryId : true;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}, [translatedItems, activeCategoryId, searchTerm]);

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
    });
  };

  const cartItemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="px-6 pt-8 pb-2">
        <h1 className="text-2xl font-bold text-gray-900">Our Menu</h1>
        {tableId && (
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full mt-2">
            <span>📍</span>
            <span>Ordering for Table {tableId}</span>
          </div>
        )}
        {usingMockData && (
          <p className="text-xs text-orange-500 mt-2">
            Showing sample menu — backend not connected yet
          </p>
        )}
      </div>

      <div className="px-6">
        <MenuFilter
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelectCategory={setActiveCategoryId}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>
        <div className="px-6 mt-2 flex gap-2">
          {(["en", "fr", "ar"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`text-xs font-mono uppercase px-3 py-1 rounded-full border transition ${
                language === lang
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
              }`}
            >
              {lang === "en" ? "EN" : lang === "fr" ? "FR" : "AR"}
            </button>
          ))}
          {translating && <span className="text-xs text-gray-400 self-center">Translating...</span>}
        </div>
      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredItems.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-10">
            No items match your search.
          </p>
        ) : (
          filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} onAddToCart={handleAddToCart} />
          ))
        )}
      </div>

      {cartItemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-black text-white px-6 py-4 flex justify-between items-center">
          <span className="font-medium">
            {cartItemCount} item{cartItemCount > 1 ? "s" : ""} — {total.toFixed(2)} TND
          </span>
          <button
            onClick={() => navigate("/cart")}
            className="bg-white text-black px-4 py-2 rounded-lg font-medium"
          >
            View Cart
          </button>
        </div>
      )}
      {tableId && <WaiterCallButton tableId={tableId} />}
      {tableId && <AIChatBox tableId={tableId} />}

    </div>
  );
}