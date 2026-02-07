"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Video, MapPin } from "lucide-react";
import { VacationPeriod } from "../../types/schedule.types";
import { format, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageProvider";
import { cn } from "@/lib/utils";

interface ClearVacationDialogProps {
  vacation: VacationPeriod;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isClearing: boolean;
}

export function ClearVacationDialog({
  vacation,
  open,
  onOpenChange,
  onConfirm,
  isClearing,
}: ClearVacationDialogProps) {
  const t = useTranslations("doctorDashboard.vacation");
  const { locale } = useLanguage();

  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return format(date, locale === "ar" ? "d MMMM yyyy" : "MMMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {t("clearVacationTitle")}
          </DialogTitle>
          <DialogDescription>{t("clearVacationDescription")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Vacation Info */}
          <div className="bg-muted p-3 rounded-md space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                className={cn(
                  "text-xs",
                  vacation.isOnline
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-purple-500 hover:bg-purple-600",
                )}
              >
                {vacation.isOnline ? (
                  <>
                    <Video className="h-3 w-3 mr-1" />
                    {t("onlineOnly")}
                  </>
                ) : (
                  <>
                    <MapPin className="h-3 w-3 mr-1" />
                    {vacation.dayOfWeek}
                  </>
                )}
              </Badge>
            </div>
            <p className="text-sm">
              <span className="font-medium">{t("fromDate")}:</span>{" "}
              {formatDate(vacation.breakStart)}
            </p>
            <p className="text-sm">
              <span className="font-medium">{t("toDate")}:</span>{" "}
              {formatDate(vacation.breakEnd)}
            </p>
            {vacation.numOfAppointments > 0 && (
              <p className="text-sm text-orange-600 font-medium">
                {vacation.numOfAppointments} {t("appointmentsCancelled")}
              </p>
            )}
          </div>

          {/* Warning */}
          <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 p-3 rounded-md">
            <p className="text-sm text-orange-900 dark:text-orange-100">
              {t("clearVacationWarning")}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isClearing}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isClearing}
          >
            {isClearing ? t("clearing") : t("confirmClear")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
