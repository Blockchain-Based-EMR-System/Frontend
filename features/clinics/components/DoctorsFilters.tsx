"use client";

import { useTranslations } from "next-intl";
import {
  parseAsStringEnum,
  parseAsInteger,
  parseAsBoolean,
  useQueryStates,
} from "nuqs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";

const MIN_FEES_OPTIONS = [50, 100, 200, 300, 400, 500];
const MAX_FEES_OPTIONS = [600, 700, 800, 900, 1000];

export function DoctorsFilters() {
  const { direction } = useLanguage();
  const t = useTranslations("clinics");
  const [filters, setFilters] = useQueryStates({
    gender: parseAsStringEnum<"MALE" | "FEMALE">(["MALE", "FEMALE"]),
    minFees: parseAsInteger,
    maxFees: parseAsInteger,
    isOnline: parseAsBoolean,
  });

  const hasFilters =
    filters.gender ||
    filters.minFees ||
    filters.maxFees ||
    filters.isOnline !== null;

  const clearFilters = () => {
    setFilters({
      gender: null,
      minFees: null,
      maxFees: null,
      isOnline: null,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>{t("filterByGender")}</Label>
        <RadioGroup
          dir={direction}
          value={filters.gender || "all"}
          className="mt-2"
          onValueChange={(value) =>
            setFilters({
              gender: value === "all" ? null : (value as "MALE" | "FEMALE"),
            })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all-genders" />
            <Label htmlFor="all-genders" className="font-normal cursor-pointer">
              {t("allGenders")}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="MALE" id="male" />
            <Label htmlFor="male" className="font-normal cursor-pointer">
              {t("male")}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="FEMALE" id="female" />
            <Label htmlFor="female" className="font-normal cursor-pointer">
              {t("female")}
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>{t("filterByFees")}</Label>
        <div className="space-y-2 mt-2">
          <Select
            dir={direction}
            value={filters.minFees?.toString()}
            onValueChange={(value) =>
              setFilters({ minFees: value ? parseInt(value) : null })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectMinFees")} />
            </SelectTrigger>
            <SelectContent>
              {MIN_FEES_OPTIONS.map((fee) => (
                <SelectItem key={fee} value={fee.toString()}>
                  {fee} {t("doctorCard.egp")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            dir={direction}
            value={filters.maxFees?.toString()}
            onValueChange={(value) =>
              setFilters({ maxFees: value ? parseInt(value) : null })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectMaxFees")} />
            </SelectTrigger>
            <SelectContent>
              {MAX_FEES_OPTIONS.map((fee) => (
                <SelectItem key={fee} value={fee.toString()}>
                  {fee} {t("doctorCard.egp")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("filterByAvailability")}</Label>
        <RadioGroup
          dir={direction}
          className="mt-2"
          value={
            filters.isOnline === true
              ? "online"
              : filters.isOnline === false
                ? "offline"
                : "all"
          }
          onValueChange={(value) =>
            setFilters({
              isOnline:
                value === "online" ? true : value === "offline" ? false : null,
            })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all-availability" />
            <Label
              htmlFor="all-availability"
              className="font-normal cursor-pointer"
            >
              {t("allAvailability")}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="online" id="online-only" />
            <Label htmlFor="online-only" className="font-normal cursor-pointer">
              {t("onlineOnly")}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="offline" id="offline-only" />
            <Label
              htmlFor="offline-only"
              className="font-normal cursor-pointer"
            >
              {t("offlineOnly")}
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
