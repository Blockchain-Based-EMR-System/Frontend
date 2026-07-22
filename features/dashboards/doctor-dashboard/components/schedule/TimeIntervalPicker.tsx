"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TimeIntervalPickerProps {
  label: string;
  startValue: string;
  endValue: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function TimeIntervalPicker({
  label,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  error,
  disabled = false,
}: TimeIntervalPickerProps) {
  const t = useTranslations("doctorDashboard.schedule");

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label
            htmlFor={`${label}-start`}
            className="text-xs text-muted-foreground"
          >
            {t("intervalStart")}
          </Label>
          <Input
            id={`${label}-start`}
            type="time"
            value={startValue}
            onChange={(e) => onStartChange(e.target.value)}
            disabled={disabled}
            className={error ? "border-destructive" : "mt-1"}
          />
        </div>
        <div className="space-y-1">
          <Label
            htmlFor={`${label}-end`}
            className="text-xs text-muted-foreground"
          >
            {t("intervalEnd")}
          </Label>
          <Input
            id={`${label}-end`}
            type="time"
            value={endValue}
            onChange={(e) => onEndChange(e.target.value)}
            disabled={disabled}
            className={error ? "border-destructive" : "mt-1"}
          />
        </div>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
