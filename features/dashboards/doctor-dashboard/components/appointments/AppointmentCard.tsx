"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  User,
  MapPin,
  Video,
  Building2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Appointment } from "../../types/appointment.types";
import { RescheduleAppointmentDialog } from "@/features/dashboards/doctor-dashboard/components/appointments/RescheduleAppointmentDialog";
import { CancelAppointmentDialog } from "@/features/dashboards/doctor-dashboard/components/appointments/CancelAppointmentDialog";
import { useLanguage } from "@/contexts/LanguageProvider";

interface AppointmentCardProps {
  appointment: Appointment;
  selectedDate: string;
}

export function AppointmentCard({
  appointment,
  selectedDate,
}: AppointmentCardProps) {
  const t = useTranslations("doctorDashboard.appointments");
  const tCommon = useTranslations("common");
  const { locale } = useLanguage();

  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const isOnline =
    appointment.clinic_name === null || appointment.clinic_name === undefined;

  const statusColors: Record<string, string> = {
    CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    COMPLETED:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const statusColor =
    statusColors[appointment.status] || statusColors.CONFIRMED;

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Video className="h-5 w-5 text-blue-500" />
              ) : (
                <Building2 className="h-5 w-5 text-gray-500" />
              )}
              <Badge className={statusColor}>
                {t(`status.${appointment.status.toLowerCase()}`)}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Patient Name */}
          <div className="flex items-start gap-3">
            <User className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">{t("patient")}</p>
              <p className="font-semibold">{appointment.patient_name}</p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">{t("time")}</p>
              <p className="font-medium">
                {appointment.start_time} - {appointment.end_time}
              </p>
              <p className="text-xs text-muted-foreground">
                {appointment.slot_duration} {t("minutes")}
                {appointment.bufferTime && (
                  <span>
                    {" "}
                    + {appointment.bufferTime} {t("buffer")}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Type */}
          <div className="flex items-start gap-3">
            <CalendarIcon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">{t("type")}</p>
              <p className="font-medium">
                {isOnline ? t("online") : t("offline")}
              </p>
            </div>
          </div>

          {/* Clinic Info (if offline) */}
          {!isOnline && appointment.clinic_name && (
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">{t("clinic")}</p>
                <p className="font-medium">{appointment.clinic_name}</p>
                {appointment.clinic_address && (
                  <p className="text-xs text-muted-foreground">
                    {appointment.clinic_address}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>

        {appointment.status === "CONFIRMED" && (
          <CardFooter className="flex gap-2 pt-3 border-t">
            <Button
              onClick={() => setIsRescheduleOpen(true)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              {t("reschedule")}
            </Button>
            <Button
              onClick={() => setIsCancelOpen(true)}
              variant="destructive"
              size="sm"
              className="flex-1"
            >
              {tCommon("cancel")}
            </Button>
          </CardFooter>
        )}
      </Card>

      <RescheduleAppointmentDialog
        appointment={appointment}
        open={isRescheduleOpen}
        onOpenChange={setIsRescheduleOpen}
        selectedDate={selectedDate}
      />

      <CancelAppointmentDialog
        appointment={appointment}
        open={isCancelOpen}
        onOpenChange={setIsCancelOpen}
      />
    </>
  );
}
