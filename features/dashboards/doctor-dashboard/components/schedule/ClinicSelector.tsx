"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Globe } from "lucide-react";
import { Clinic } from "../../types/clinic.types";
import { useLanguage } from "@/contexts/LanguageProvider";

interface ClinicSelectorProps {
  clinics: Clinic[];
  selectedClinicId: string | null;
  onClinicChange: (clinicId: string | null) => void;
  disabled?: boolean;
}

export function ClinicSelector({
  clinics,
  selectedClinicId,
  onClinicChange,
  disabled = false,
}: ClinicSelectorProps) {
  const t = useTranslations("doctorDashboard.schedule");
  const { direction } = useLanguage();

  if (!clinics || clinics.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 py-4" dir={direction}>
          <Globe className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">{t("onlineOnly")}</p>
            <p className="text-sm text-muted-foreground">
              {t("onlineOnlyDescription")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="clinic-selector" className="text-base">
        {t("selectClinic")}
      </Label>
      <Select
        dir={direction}
        value={selectedClinicId || "online"}
        onValueChange={(value) =>
          onClinicChange(value === "online" ? null : value)
        }
        disabled={disabled}
      >
        <SelectTrigger id="clinic-selector" className="w-full">
          <SelectValue placeholder={t("selectClinicPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="online">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{t("onlineOnly")}</span>
            </div>
          </SelectItem>
          {clinics.map((clinic) => (
            <SelectItem key={clinic.id} value={clinic.id}>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>{clinic.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
