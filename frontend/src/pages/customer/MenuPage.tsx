import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMenu } from "@/hooks/useMenu";
import { useCart } from "@/hooks/useCart";
import { useMenuRecommendations } from "@/hooks/useMenuRecommendations";
import { useMenuTranslation } from "@/hooks/useMenuTranslation";
import { MenuFilter } from "@/components/customer/MenuFilter";
import { MenuCard } from "@/components/customer/MenuCard";
import { MenuItem } from "@/types/menu.types";
import { WaiterCallButton } from "@/components/customer/WaiterCallButton";
import { AIChatBox } from "@/components/customer/AIChatBox";

const gridContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const gridItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

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
    return items.map((it) =>
      recommendedIds.has(it.id) ? { ...it, tags: [...(it.tags ?? []), "ai-recommended"] } : it
    );
  }, [items, recommendedIds]);

  const { language, setLanguage, translatedItems, loading: translating } = useMenuTranslation(itemsWithAiTags);

  const filteredItems = useMemo(() => {
    return translatedItems.filter((it) => {
      const matchesCategory = activeCategoryId ? it.categoryId === activeCategoryId : true;
      const matchesSearch = it.name.toLowerCase().includes(searchTerm.toLowerCase());
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
      <div className="min-h-screen bg-noir flex items-center justify-center">
        <p className="text-smoke">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noir pb-24">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-8 pb-2"
      >
        <h1 className="font-display text-2xl font-semibold text-linen">Our Menu</h1>
        {tableId && (
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-sm font-medium px-3 py-1 rounded-full mt-2">
            <span>📍</span>
            <span>Ordering for Table {tableId}</span>
          </div>
        )}
        {usingMockData && (
          <p className="text-xs text-gold mt-2">
            Showing sample menu — backend not connected yet
          </p>
        )}
      </motion.div>

      <div className="px-6">
        <MenuFilter
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelectCategory={setActiveCategoryId}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="flex gap-2 mb-4">
          {(["en", "fr", "ar"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`text-xs font-mono uppercase px-3 py-1 rounded-full border transition-colors ${
                language === lang
                  ? "bg-gold text-noir border-gold"
                  : "bg-charcoal text-smoke border-gold/20 hover:border-gold/50"
              }`}
            >
              {lang === "en" ? "EN" : lang === "fr" ? "FR" : "AR"}
            </button>
          ))}
          {translating && <span className="text-xs text-smoke self-center">Translating...</span>}
        </div>
      </div>

      <div dir={language === "ar" ? "rtl" : "ltr"} className="px-6">
        {filteredItems.length === 0 ? (
          <p className="text-smoke col-span-full text-center py-10">No items match your search.</p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategoryId ?? "all"}
              variants={gridContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {filteredItems.map((item) => (
                <motion.div key={item.id} variants={gridItem}>
                  <MenuCard item={item} onAddToCart={handleAddToCart} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-charcoal border-t border-gold/20 text-linen px-6 py-4 flex justify-between items-center"
          >
            <span className="font-medium">
              {cartItemCount} item{cartItemCount > 1 ? "s" : ""} — {total.toFixed(2)} TND
            </span>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/cart")}
              className="bg-gold text-noir px-4 py-2 rounded-lg font-medium"
            >
              View Cart
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {tableId && <WaiterCallButton tableId={tableId} />}
      {tableId && <AIChatBox tableId={tableId} />}
    </div>
  );
}