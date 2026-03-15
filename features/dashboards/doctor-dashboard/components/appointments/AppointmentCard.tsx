"use client";

import { useMemo, useState } from "react";
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
  CalendarClock,
  X,
  CheckCircle2,
  XCircle,
  Mic,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Appointment } from "../../types/appointment.types";
import { RescheduleAppointmentDialog } from "@/features/dashboards/doctor-dashboard/components/appointments/RescheduleAppointmentDialog";
import { CancelAppointmentDialog } from "@/features/dashboards/doctor-dashboard/components/appointments/CancelAppointmentDialog";
import { cn } from "@/lib/utils";
import { getTimeIn12HourFormat } from "@/lib/helpers";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useSessionGate } from "@/features/appointment-session";
import {
  formatCountdown,
  parseAppointmentStart,
} from "@/features/appointment-session";
import { useSoapDraftStore } from "@/stores/useSoapDraftStore";

interface AppointmentCardProps {
  appointment: Appointment;
  selectedDate: string;
}

export function AppointmentCard({
  appointment,
  selectedDate,
}: AppointmentCardProps) {
  const router = useRouter();
  const t = useTranslations("doctorDashboard.appointments");
  const tCommon = useTranslations("common");
  const tSession = useTranslations("doctorDashboard.sessions");
  const { locale } = useLanguage();

  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const soapState = useSoapDraftStore(
    (state) => state.byAppointment[appointment.id],
  );

  const sessionStart = useMemo(() => {
    return parseAppointmentStart(
      appointment.appointment_date,
      appointment.start_time,
    );
  }, [appointment.appointment_date, appointment.start_time]);

  const isOnline =
    appointment.clinic_name === null || appointment.clinic_name === undefined;
  const gate = useSessionGate(sessionStart, isOnline ? 5 : 10);
  const isCompleted = appointment.status === "COMPLETED";
  const isCancelled = appointment.status === "CANCELLED";

  const statusColors: Record<string, string> = {
    CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    COMPLETED:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const sessionStatusColors: Record<string, string> = {
    recording: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    uploading:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    processing:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    "draft-ready":
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
    failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const statusColor =
    statusColors[appointment.status] || statusColors.CONFIRMED;

  const cardBorderColor =
    appointment.status === "COMPLETED"
      ? "border-green-800"
      : appointment.status === "CANCELLED"
        ? "border-red-800"
        : "";

  const sessionPath = isOnline
    ? `/doctor-dashboard/appointments/${appointment.id}/online/lobby`
    : `/doctor-dashboard/appointments/${appointment.id}/offline-session`;

  const sessionButtonLabel = isOnline
    ? tSession("meeting.join")
    : tSession("offline.startSession");

  const showSessionControls = appointment.status === "CONFIRMED";
  const showMeetingCountdown =
    showSessionControls && !!sessionStart && !gate.hasStarted;

  const onOpenSession = () => {
    if (!sessionStart) return;

    const params = new URLSearchParams({
      startAt: sessionStart.toISOString(),
    });

    router.push(`${sessionPath}?${params.toString()}`);
  };

  return (
    <>
      <Card
        className={cn(
          "transition-all relative",
          cardBorderColor,
          isCompleted || isCancelled ? "opacity-60" : "hover:shadow-md",
          isCompleted ? "bg-green-800/30" : isCancelled ? "bg-red-800/30" : "",
        )}
      >
        {(isCompleted || isCancelled) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            {isCompleted ? (
              <CheckCircle2 className="h-16 w-16 text-green-600 drop-shadow-lg opacity-30" />
            ) : (
              <XCircle className="h-16 w-16 text-red-600 drop-shadow-lg opacity-30" />
            )}
          </div>
        )}

        <CardHeader className="pb-2 pt-3 px-3">
          <div className="flex items-center justify-between gap-2">
            <p
              className={cn(
                "text-base font-semibold px-3 py-2 rounded-xl",
                "bg-transparent text-black dark:text-white border-2 flex items-center gap-3",
              )}
            >
              {isOnline ? (
                <Video className="h-4 w-4" />
              ) : (
                <Building2 className="h-4 w-4" />
              )}
            </p>

            <div className="flex items-center gap-1.5">
              {soapState &&
                soapState.status !== "idle" &&
                soapState.status !== "confirmed" && (
                  <Badge
                    className={cn(
                      "text-xs hover:bg-transparent",
                      sessionStatusColors[soapState.status],
                    )}
                  >
                    {tSession(`status.${soapState.status}`)}
                  </Badge>
                )}
              <Badge
                className={cn("text-xs hover:bg-transparent", statusColor)}
              >
                {t(`status.${appointment.status.toLowerCase()}`)}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-3 py-2 space-y-1.5">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <p className="font-semibold text-sm">{appointment.patient_name}</p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="font-medium">
              <span>
                {getTimeIn12HourFormat(appointment.start_time, locale)}
              </span>
              {" - "}
              <span>{getTimeIn12HourFormat(appointment.end_time, locale)}</span>
            </span>
            <span className="text-xs text-muted-foreground">
              ({appointment.slot_duration}m)
            </span>
          </div>

          {!isOnline && appointment.clinic_name && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{appointment.clinic_name}</span>
            </div>
          )}

          {showMeetingCountdown && (
            <p className="text-xs text-muted-foreground">
              {gate.isTooEarly
                ? tSession("meeting.availableIn", {
                    time: formatCountdown(gate.secondsUntilEnabled),
                  })
                : tSession("meeting.startsIn", {
                    time: formatCountdown(gate.secondsUntilStart),
                  })}
            </p>
          )}
        </CardContent>

        {(showSessionControls || soapState?.status === "draft-ready") && (
          <CardFooter className="flex flex-col gap-2 px-3 py-2 pt-1.5">
            {showSessionControls && (
              <div className="flex w-full gap-1.5">
                <Button
                  onClick={() => setIsRescheduleOpen(true)}
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs px-2"
                  title={t("reschedule")}
                >
                  <CalendarClock className="h-3.5 w-3.5 mr-1" />
                  {t("reschedule")}
                </Button>
                <Button
                  onClick={() => setIsCancelOpen(true)}
                  variant="destructive"
                  size="sm"
                  className="flex-1 h-8 text-xs px-2"
                  title={tCommon("cancel")}
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  {tCommon("cancel")}
                </Button>
              </div>
            )}

            {showSessionControls && (
              <Button
                onClick={onOpenSession}
                variant="default"
                size="sm"
                className="w-full h-8 text-xs px-2"
                disabled={gate.isTooEarly}
              >
                <Mic className="h-3.5 w-3.5 mr-1" />
                {sessionButtonLabel}
              </Button>
            )}

            {soapState?.status === "draft-ready" && (
              <Button
                onClick={() =>
                  router.push(
                    `/doctor-dashboard/appointments/${appointment.id}/soap-review`,
                  )
                }
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs px-2"
              >
                {tSession("soap.reviewAction")}
              </Button>
            )}
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
