"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { TimeIntervalPicker } from "./TimeIntervalPicker";
import { DayOfWeek, DayConfiguration } from "../../types/schedule.types";
import { useLanguage } from "@/contexts/LanguageProvider";

interface DayConfigCardProps {
  config: DayConfiguration;
  onChange: (config: DayConfiguration) => void;
  hasClinic: boolean;
  clinicOpeningTime?: string;
  clinicClosingTime?: string;
}

export function DayConfigCard({
  config,
  onChange,
  hasClinic,
  clinicOpeningTime,
  clinicClosingTime,
}: DayConfigCardProps) {
  const t = useTranslations("doctorDashboard.schedule");
  const tFields = useTranslations("fields");
  const { direction, locale } = useLanguage();

  const dayName = t(`days.${config.day}`);

  const handleActiveChange = (checked: boolean) => {
    onChange({ ...config, isActive: checked });
  };

  const handleFieldChange = (field: keyof DayConfiguration, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const handleIntervalChange = (
    type: "offline" | "online",
    field: "start" | "end",
    value: string,
  ) => {
    const intervalKey =
      type === "offline" ? "offlineInterval" : "onlineInterval";
    
    let currentInterval = config[intervalKey];
    
    if (!currentInterval) {
      if (type === "offline") {
        currentInterval = {
          start: clinicOpeningTime || "09:00",
          end: clinicClosingTime || "17:00",
        };
      } else {
        currentInterval = {
          start: "09:00",
          end: "17:00",
        };
      }
    }

    onChange({
      ...config,
      [intervalKey]: {
        ...currentInterval,
        [field]: value,
      },
    });
  };

  return (
    <Card className={!config.isActive ? "opacity-60" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{dayName}</CardTitle>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`day-${config.day}-active`}
              checked={config.isActive}
              onCheckedChange={handleActiveChange}
            />
            <Label
              htmlFor={`day-${config.day}-active`}
              className="text-sm font-normal cursor-pointer"
            >
              {!config.isActive
                ? locale === "en"
                  ? "Add"
                  : "إضافة"
                : locale === "en"
                  ? "Added"
                  : "مضاف"}
            </Label>
          </div>
        </div>
      </CardHeader>

      {config.isActive && (
        <CardContent className="space-y-4">
          {/* Slot Duration & Buffer Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm">{t("slotDuration")}</Label>
              <Input
                className="mt-1"
                type="number"
                min="5"
                max="120"
                placeholder={t("slotDurationPlaceholder")}
                value={config.slotDuration}
                onChange={(e) =>
                  handleFieldChange("slotDuration", parseInt(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">{t("bufferTime")}</Label>
              <Input
                className="mt-1"
                type="number"
                min="0"
                max="60"
                placeholder={t("bufferTimePlaceholder")}
                value={config.bufferTime}
                onChange={(e) =>
                  handleFieldChange("bufferTime", parseInt(e.target.value))
                }
              />
            </div>
          </div>

          {/* Time Interval Picker - Offline for clinics, Online for "Online Only" */}
          {hasClinic ? (
            <TimeIntervalPicker
              key={`offline-interval-${config.day}`}
              label={t("workingHours")}
              startValue={
                config.offlineInterval?.start || clinicOpeningTime || "09:00"
              }
              endValue={
                config.offlineInterval?.end || clinicClosingTime || "17:00"
              }
              onStartChange={(val) =>
                handleIntervalChange("offline", "start", val)
              }
              onEndChange={(val) => handleIntervalChange("offline", "end", val)}
            />
          ) : (
            <TimeIntervalPicker
              key={`online-interval-${config.day}`}
              label={t("workingHours")}
              startValue={config.onlineInterval?.start || "09:00"}
              endValue={config.onlineInterval?.end || "17:00"}
              onStartChange={(val) =>
                handleIntervalChange("online", "start", val)
              }
              onEndChange={(val) => handleIntervalChange("online", "end", val)}
            />
          )}
        </CardContent>
      )}
    </Card>
  );
}
