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
import { Appointment } from "../../types/appointment.types";
import { useCancelAppointment } from "../../query/useAppointments.query";
import { AlertTriangle } from "lucide-react";

interface CancelAppointmentDialogProps {
  appointment: Appointment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelAppointmentDialog({
  appointment,
  open,
  onOpenChange,
}: CancelAppointmentDialogProps) {
  const t = useTranslations("doctorDashboard.appointments");
  const tCommon = useTranslations("common");

  const cancelMutation = useCancelAppointment();

  const handleCancel = () => {
    cancelMutation.mutate(appointment.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!cancelMutation.isPending) {
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {t("cancelTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("cancelDescription", {
              patient: appointment.patient_name,
              time: appointment.start_time,
              date: appointment.appointment_date,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="p-4 bg-destructive/10 rounded-md">
            <p className="text-sm font-medium text-destructive">
              {t("cancelWarning")}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={cancelMutation.isPending}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending
              ? tCommon("submitting")
              : t("confirmCancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
