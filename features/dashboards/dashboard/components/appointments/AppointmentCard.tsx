"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  MapPin,
  Video,
  Calendar,
  X,
  CalendarClock,
  Building2,
} from "lucide-react";
import { Appointment } from "../../types/dashboardTypes";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { getInitials } from "@/lib/helpers";
import { useLanguage } from "@/contexts/LanguageProvider";
import type { Locale } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  formatCountdown,
  parseAppointmentStart,
  useSessionGate,
} from "@/features/appointment-session";

interface AppointmentCardProps {
  appointment: Appointment;
  isPast: boolean;
  onCancel?: (appointmentId: string) => void;
  onReschedule?: (appointment: Appointment) => void;
  tDashboard: (key: string) => string;
  tCommon: (key: string) => string;
}

const formatTime = (dateString: string, locale?: string) => {
  if (!dateString || dateString.includes("undefined")) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const localeObj = locale === "ar" ? ar : undefined;
    return format(date, "h:mm a", { locale: localeObj as Locale });
  } catch {
    return "";
  }
};

const formatDate = (dateString: string, locale?: string) => {
  if (!dateString || dateString.includes("undefined")) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const localeObj = locale === "ar" ? ar : undefined;
    return format(date, "EEEE, MMMM d, yyyy", { locale: localeObj as Locale });
  } catch {
    return "";
  }
};

const getStatusBadge = (
  status: Appointment["status"],
  tDashboard: (key: string) => string,
) => {
  const statusMap: Record<
    Appointment["status"],
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      label: string;
    }
  > = {
    CONFIRMED: { variant: "default", label: tDashboard("confirmed") },
    COMPLETED: { variant: "secondary", label: tDashboard("completed") },
    CANCELLED: { variant: "destructive", label: tDashboard("cancelled") },
    RESCHEDULED: { variant: "outline", label: tDashboard("rescheduled") },
  };

  const config = statusMap[status];
  return <Badge variant={config?.variant}>{config?.label}</Badge>;
};

export function AppointmentCard({
  appointment,
  isPast,
  onCancel,
  onReschedule,
  tDashboard,
  tCommon,
}: AppointmentCardProps) {
  const router = useRouter();
  const { locale } = useLanguage();

  const startDate = useMemo(
    () => parseAppointmentStart(appointment.scheduledTime),
    [appointment.scheduledTime],
  );
  const gate = useSessionGate(startDate, 5);

  const canJoinSession =
    appointment.online &&
    !isPast &&
    (appointment.status === "CONFIRMED" ||
      appointment.status === "RESCHEDULED");
  const showMeetingCountdown =
    canJoinSession && !!startDate && !gate.hasStarted;

  const onJoinSession = () => {
    if (!startDate) return;

    const params = new URLSearchParams({
      startAt: startDate.toISOString(),
    });

    router.push(
      `/dashboard/appointments/${appointment.id}/online/lobby?${params.toString()}`,
    );
  };

  return (
    <Card className={isPast ? "opacity-70" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {formatDate(appointment.scheduledTime, locale)}
            </span>
          </div>
          {getStatusBadge(appointment.status, tDashboard)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage
              src={appointment.doctor?.profilePic || undefined}
              alt={appointment.doctor?.name || "Doctor"}
            />
            <AvatarFallback>
              {getInitials(appointment.doctor?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold">
              {tCommon("doctor")}
              {appointment.doctor?.name || "Unknown"}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {formatTime(appointment.scheduledTime, locale)} -{" "}
            {formatTime(appointment.scheduledEndTime, locale)}
          </span>
        </div>

        {appointment.online ? (
          <div className="flex items-center gap-2 text-sm">
            <Video className="h-4 w-4" />
            <span className="font-medium">
              {tDashboard("onlineConsultation")}
            </span>
          </div>
        ) : (
          appointment.clinic && (
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">{appointment.clinic.name}</p>
                  <p className="text-muted-foreground">
                    {appointment.clinic.address}
                  </p>
                </div>
              </div>
              {appointment.clinic.mapsLink && (
                <Link
                  href={appointment.clinic.mapsLink}
                  className="flex items-start gap-2 text-sm text-primary"
                >
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">
                      {locale === "en" ? "Directions" : "الاتجاهات"}
                    </p>
                  </div>
                </Link>
              )}
            </div>
          )
        )}

        {!isPast && (onCancel || onReschedule) && (
          <div className="flex gap-2 pt-2">
            {onReschedule && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReschedule(appointment)}
                className="flex-1"
              >
                <CalendarClock className="h-4 w-4 mr-2" />
                {tDashboard("reschedule")}
              </Button>
            )}
            {onCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(appointment.id)}
                className="flex-1 text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4 mr-2" />
                {tDashboard("cancel")}
              </Button>
            )}
          </div>
        )}

        {canJoinSession && (
          <div className="space-y-2 pt-1">
            <Button
              onClick={onJoinSession}
              className="w-full"
              disabled={gate.isTooEarly}
            >
              <Video className="h-4 w-4 mr-2" />
              {tDashboard("joinSession")}
            </Button>
            {showMeetingCountdown && (
              <p className="text-xs text-muted-foreground">
                {gate.isTooEarly
                  ? `${tDashboard("meetingAvailableInPrefix")} ${formatCountdown(
                      gate.secondsUntilEnabled,
                    )}`
                  : `${tDashboard("meetingStartsInPrefix")} ${formatCountdown(
                      gate.secondsUntilStart,
                    )}`}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
