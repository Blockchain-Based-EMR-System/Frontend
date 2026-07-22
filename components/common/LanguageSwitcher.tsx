"use client";

import { useLanguage } from "@/contexts/LanguageProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="relative gap-2 flex items-center"
          aria-label="Change language"
        >
          <Globe className="h-[1.2rem] w-[1.2rem] transition-all" />
          <span className="text-sm font-medium">
            {locale === "en" ? "EN" : "ع"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px] space-y-1">
        <DropdownMenuItem
          onClick={() => setLocale("en")}
          className={`cursor-pointer ${locale === "en" ? "bg-accent" : ""}`}
        >
          <span className="flex items-center gap-2">
            <span>English</span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale("ar")}
          className={`cursor-pointer ${locale === "ar" ? "bg-accent" : ""}`}
        >
          <span className="flex items-center gap-2">
            <span>العربية</span>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
