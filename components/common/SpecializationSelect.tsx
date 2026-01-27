"use client";

import { useLocale } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SPECIALIZATIONS,
  VALID_SPECIALIZATION_KEYS,
  SpecializationKey,
} from "@/constants/specializations";

interface SpecializationSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SpecializationSelect({
  value,
  onValueChange,
  placeholder = "Select specialization",
  disabled = false,
}: SpecializationSelectProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {VALID_SPECIALIZATION_KEYS.map((key) => {
          const spec = SPECIALIZATIONS[key as SpecializationKey];
          const displayText = isArabic ? spec.ar : spec.en;
          return (
            <SelectItem key={key} value={spec.en}>
              {displayText}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
