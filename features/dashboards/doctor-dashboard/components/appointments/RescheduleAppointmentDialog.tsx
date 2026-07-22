"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Appointment } from "../../types/appointment.types";
import { useRescheduleAppointment } from "../../query/useAppointments.query";
import { utcToLocalDateTime, getTimeIn12HourFormat } from "@/lib/helpers";
import { useLanguage } from "@/contexts/LanguageProvider";

interface RescheduleAppointmentDialogProps {
  appointment: Appointment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: string;
}

export function RescheduleAppointmentDialog({
  appointment,
  open,
  onOpenChange,
  selectedDate,
}: RescheduleAppointmentDialogProps) {
  const t = useTranslations("doctorDashboard.appointments");
  const tCommon = useTranslations("common");
  const { locale } = useLanguage();

  const [minutes, setMinutes] = useState<number>(15);

  const rescheduleMutation = useRescheduleAppointment();

  const handleReschedule = () => {
    if (minutes < 1 || minutes > 60) {
      return;
    }

    rescheduleMutation.mutate(
      {
        appointmentId: appointment.id,
        minutes,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setMinutes(15); 
        },
      },
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!rescheduleMutation.isPending) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setMinutes(15);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("rescheduleTitle")}</DialogTitle>
          <DialogDescription>
            {t("rescheduleDescription", {
              patient: appointment.patient_name,
              time: getTimeIn12HourFormat(
                utcToLocalDateTime(appointment.appointment_date, appointment.start_time),
                locale,
              ),
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="minutes">{t("delayMinutes")}</Label>
            <Input
              id="minutes"
              type="number"
              min="1"
              max="60"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
              placeholder={t("delayMinutesPlaceholder")}
            />
            <p className="text-xs text-muted-foreground">{t("maxDelayNote")}</p>
          </div>

          {minutes > 0 && minutes <= 60 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {t("newTime")}:{" "}
                {getTimeIn12HourFormat(
                  calculateNewTime(
                    utcToLocalDateTime(appointment.appointment_date, appointment.start_time),
                    minutes,
                  ),
                  locale,
                )}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={rescheduleMutation.isPending}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            onClick={handleReschedule}
            disabled={
              rescheduleMutation.isPending || minutes < 1 || minutes > 60
            }
          >
            {rescheduleMutation.isPending
              ? tCommon("submitting")
              : t("reschedule")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function calculateNewTime(startTime: string, minutesToAdd: number): string {
  // startTime may be a full datetime string or just HH:MM
  const timePart = startTime.includes("T") ? startTime.split("T")[1] : startTime;
  const [hours, minutes] = timePart.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + minutesToAdd;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
}
