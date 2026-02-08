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
import { AlertTriangle, Video, MapPin, Building2 } from "lucide-react";
import { VacationDetail } from "../../types/schedule.types";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useCancelVacation } from "../../query/useSchedule.query";
import { cn } from "@/lib/utils";
import { convertDayResponseToNormalFormat } from "./helpers"

interface CancelVacationDialogProps {
  vacationDetail: VacationDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelVacationDialog({
  vacationDetail,
  open,
  onOpenChange,
}: CancelVacationDialogProps) {
  const t = useTranslations("doctorDashboard.vacation");
  const tDays = useTranslations("doctorDashboard.schedule.days");
  const { locale } = useLanguage();
  const cancelVacationMutation = useCancelVacation();

  const handleConfirm = () => {
    cancelVacationMutation.mutate(
      {
        vacationId: vacationDetail.vacationId,
        scheduleId: vacationDetail.scheduleId,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {t("cancelVacationTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("cancelVacationDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Vacation Info */}
          <div className="bg-muted p-3 rounded-md space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                className={cn(
                  "text-xs",
                  vacationDetail.isOnline
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-purple-500 hover:bg-purple-600",
                )}
              >
                {vacationDetail.isOnline ? (
                  <div className="flex items-center gap-2">
                    <Video className="h-3 w-3" />
                    {t("online")}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3 w-3" />
                    {t("offline")}  
                  </div>
                )}
              </Badge>
            </div>
            <p className="text-sm">
              <span className="font-medium">{t("dayOfWeek")}:</span>{" "}
              {tDays(convertDayResponseToNormalFormat(vacationDetail.dayOfWeek))}
            </p>
            {!vacationDetail.isOnline && vacationDetail.clinicName && (
              <>
                <p className="text-sm">
                  <span className="font-medium">{t("clinicName")}:</span>{" "}
                  {vacationDetail.clinicName}
                </p>
                {vacationDetail.clinicAddress && (
                  <p className="text-sm text-muted-foreground">
                    {vacationDetail.clinicAddress}
                  </p>
                )}
              </>
            )}
            {vacationDetail.cancelledAppointments > 0 && (
              <p className="text-sm text-orange-600 font-medium">
                {vacationDetail.cancelledAppointments}{" "}
                {t("appointmentsCancelled")}
              </p>
            )}
          </div>

          <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 p-3 rounded-md">
            <p className="text-sm text-orange-900 dark:text-orange-100">
              {t("cancelVacationWarning")}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={cancelVacationMutation.isPending}
          >
            {t("back")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={cancelVacationMutation.isPending}
          >
            {cancelVacationMutation.isPending
              ? t("cancelling")
              : t("confirmCancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
