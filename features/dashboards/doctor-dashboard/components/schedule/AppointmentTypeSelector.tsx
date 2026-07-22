"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AppointmentType } from "../../types/schedule.types";
import { useLanguage } from "@/contexts/LanguageProvider";

interface AppointmentTypeSelectorProps {
  value: AppointmentType;
  onChange: (value: AppointmentType) => void;
  hasClinic: boolean;
  disabled?: boolean;
  dayId: string;
}

export function AppointmentTypeSelector({
  value,
  onChange,
  hasClinic,
  disabled = false,
  dayId,
}: AppointmentTypeSelectorProps) {
  const t = useTranslations("doctorDashboard.schedule");
  const { direction } = useLanguage();

  if (!hasClinic) {
    return (
      <div className="space-y-2" dir={direction}>
        <Label className="text-sm font-medium">{t("appointmentType")}</Label>
        <div className="rounded-md border p-3 bg-muted/50">
          <p className="text-sm text-muted-foreground">{t("onlineOnlyType")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3" dir={direction}>
      <Label className="text-sm font-medium">{t("appointmentType")}</Label>
      <RadioGroup
        value={value}
        onValueChange={(val: string) => onChange(val as AppointmentType)}
        disabled={disabled}
        className="space-y-1"
      >
        <div className="flex items-center space-x-2 mt-2" dir={direction}>
          <RadioGroupItem value="offline" id={`offline-${dayId}`} />
          <Label
            htmlFor={`offline-${dayId}`}
            className="font-normal cursor-pointer"
          >
            {t("offlineOnly")}
          </Label>
        </div>
        <div className="flex items-center space-x-2" dir={direction}>
          <RadioGroupItem value="online" id={`online-${dayId}`} />
          <Label
            htmlFor={`online-${dayId}`}
            className="font-normal cursor-pointer"
          >
            {t("onlineOnlyType")}
          </Label>
        </div>
        <div className="flex items-center space-x-2" dir={direction}>
          <RadioGroupItem value="both" id={`both-${dayId}`} />
          <Label
            htmlFor={`both-${dayId}`}
            className="font-normal cursor-pointer"
          >
            {t("both")}
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
