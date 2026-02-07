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
import { AlertTriangle } from "lucide-react";

interface DeleteScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayName: string;
  appointmentCount?: number;
  onConfirm: () => void;
  onCancel?: () => void;
  isDeleting: boolean;
}

export function DeleteScheduleDialog({
  open,
  onOpenChange,
  dayName,
  appointmentCount,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteScheduleDialogProps) {
  const t = useTranslations("doctorDashboard.schedule");
  const tCommon = useTranslations("common");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <DialogTitle>{t("deleteScheduleTitle")}</DialogTitle>
              <DialogDescription className="mt-1">
                {t("deleteScheduleDescription", { day: dayName })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="bg-muted p-4 rounded-lg space-y-2">
          {appointmentCount !== undefined && appointmentCount > 0 && (
            <div className="bg-destructive/10 p-3 rounded-md mb-3">
              <p className="text-sm font-medium text-destructive">
                {t("deleteScheduleAppointmentsWarning", {
                  count: appointmentCount,
                })}
              </p>
            </div>
          )}
          <p className="text-sm font-medium text-destructive">
            {t("deleteScheduleWarning")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("deleteScheduleConsequence")}
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            {tCommon("cancel")}
          </Button>
          {onCancel && (
            <Button
              variant="secondary"
              onClick={onCancel}
              disabled={isDeleting}
            >
              {t("skipDeletions")}
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? tCommon("deleting") : t("confirmDelete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
