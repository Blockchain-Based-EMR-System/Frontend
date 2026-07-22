"use client";

import { useTranslations } from "next-intl";
import { parseAsBoolean, useQueryStates } from "nuqs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";

export function ClinicsFilters() {
  const { direction } = useLanguage();
  const t = useTranslations("clinics");
  const [filters, setFilters] = useQueryStates({
    canPayOnline: parseAsBoolean,
  });

  const hasFilters = filters.canPayOnline !== null;

  const clearFilters = () => {
    setFilters({ canPayOnline: null });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>{t("filterByPayment")}</Label>
        <RadioGroup
          dir={direction}
          className="mt-2"
          value={
            filters.canPayOnline === true
              ? "online"
              : filters.canPayOnline === false
                ? "offline"
                : "all"
          }
          onValueChange={(value) =>
            setFilters({
              canPayOnline:
                value === "online" ? true : value === "offline" ? false : null,
            })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all-payment" />
            <Label htmlFor="all-payment" className="font-normal cursor-pointer">
              {t("allPaymentOptions")}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="online" id="online-payment" />
            <Label
              htmlFor="online-payment"
              className="font-normal cursor-pointer"
            >
              {t("canPayOnline")}
            </Label>
          </div>
        </RadioGroup>
      </div>

      {hasFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          {t("clearFilters")}
        </Button>
      )}
    </div>
  );
}
