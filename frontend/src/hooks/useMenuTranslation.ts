import { useState, useCallback } from "react";
import * as aiService from "@/services/aiService";
import { MenuItem } from "@/types/menu.types";
import { MenuLanguage, TranslatedMenuItem } from "@/types/ai.types";

export function useMenuTranslation(items: MenuItem[]) {
  const [language, setLanguageState] = useState<MenuLanguage>("en");
  const [translations, setTranslations] = useState<Partial<Record<MenuLanguage, Map<string, TranslatedMenuItem>>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setLanguage = useCallback(
    async (lang: MenuLanguage) => {
      setLanguageState(lang);
      setError(null);

      if (lang === "en" || translations[lang]) return; // original, or already cached

      setLoading(true);
      try {
        const result = await aiService.getTranslatedMenu(lang);
        const map = new Map(result.items.map((t) => [t.menuItemId, t]));
        setTranslations((prev) => ({ ...prev, [lang]: map }));
      } catch {
        setError("Translation unavailable right now");
      } finally {
        setLoading(false);
      }
    },
    [translations]
  );

  const translatedItems = items.map((item) => {
    if (language === "en") return item;
    const t = translations[language]?.get(item.id);
    return t ? { ...item, name: t.name, description: t.description } : item;
  });

  return { language, setLanguage, translatedItems, loading, error };
}