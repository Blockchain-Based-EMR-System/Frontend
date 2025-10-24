"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Locale = "en" | "ar";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  direction: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  children,
  initialLocale = "en",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  const direction = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    // Update document direction and lang
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;
  }, [locale, direction]);

  const setLocale = async (newLocale: Locale) => {
    setLocaleState(newLocale);

    // Set cookie for persistence
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Refresh to apply new locale (without changing URL)
    router.refresh();
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, direction }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
