"use client";

import { useLanguage } from "@/contexts/LanguageProvider";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLocale(locale === "en" ? "ar" : "en")}
    >
      {locale === "en" ? "العربية" : "English"}
    </Button>
  );
}
