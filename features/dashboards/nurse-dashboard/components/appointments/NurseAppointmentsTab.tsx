"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  Clock,
  Phone,
  CalendarOff,
  CheckCircle2,
  Loader2,
  Settings2,
  Stethoscope,
  Building2,
} from "lucide-react";
import { NurseScheduleEntry } from "../../types/nurseDashboardTypes";
import {
  useNurseSchedule,
  useNurseDashboardAppointments,
  useCompleteNurseAppointment,
} from "../../query/useNurseDashboard.query";
import { AppointmentSelectionDialog } from "./AppointmentSelectionDialog";
import { useLanguage } from "@/contexts/LanguageProvider";
import { getTimeIn12HourFormat } from "@/lib/helpers";
import { NurseAppointmentItem } from "../../types/nurseDashboardTypes";

const USE_DUMMY_DATA = false;

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toTimeString = (hour: number, minute: number): string =>
  `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

const now = new Date();
const todayLocalDate = formatLocalDate(now);
const currentHour = now.getHours();
const slotBaseHour = Math.min(Math.max(currentHour, 8), 18);

const DUMMY_SCHEDULE_ENTRIES: NurseScheduleEntry[] = [
  {
    id: "dummy-schedule-1",
    doctor: {
      id: "doctor-1",
      name: "Dr. Ahmed Hassan",
      gender: "MALE",
      profilePic: null,
    },
    clinic: {
      id: "clinic-1",
      name: "Main Street Clinic",
      address: "123 Main St, Downtown",
      address_maps_link: null,
    },
    working_days: [
      {
        day_of_week: format(now, "EEEE").toUpperCase(),
        start_time: toTimeString(slotBaseHour, 0),
        end_time: toTimeString(Math.min(slotBaseHour + 6, 23), 0),
      },
      {
        day_of_week: "WEDNESDAY",
        start_time: "09:00",
        end_time: "15:00",
      },
    ],
  },
  {
    id: "dummy-schedule-2",
    doctor: {
      id: "doctor-2",
      name: "Dr. Sara Mohamed",
      gender: "FEMALE",
      profilePic: null,
    },
    clinic: {
      id: "clinic-2",
      name: "Downtown Medical Center",
      address: "456 Healthcare Blvd",
      address_maps_link: null,
    },
    working_days: [
      {
        day_of_week: format(now, "EEEE").toUpperCase(),
        start_time: toTimeString(slotBaseHour, 0),
        end_time: toTimeString(Math.min(slotBaseHour + 5, 23), 0),
      },
      {
        day_of_week: "THURSDAY",
        start_time: "10:00",
        end_time: "16:00",
      },
    ],
  },
];

const DUMMY_APPOINTMENTS: NurseAppointmentItem[] = [
  {
    id: "dummy-appt-1",
    clinic: {
      id: "clinic-1",
      name: "Main Street Clinic",
      address: "123 Main St, Downtown",
      address_maps_link: null,
    },
    patient: {
      id: "patient-1",
      name: "Mohamed Ali",
      gender: "MALE",
      phone: "+20 100 000 1111",
    },
    status: "CONFIRMED",
    slot_duration: 30,
    appointment_date: todayLocalDate,
    start_time: toTimeString(slotBaseHour, 0),
    end_time: toTimeString(slotBaseHour, 30),
  },
  {
    id: "dummy-appt-2",
    clinic: {
      id: "clinic-1",
      name: "Main Street Clinic",
      address: "123 Main St, Downtown",
      address_maps_link: null,
    },
    patient: {
      id: "patient-2",
      name: "Nour Hassan",
      gender: "FEMALE",
      phone: "+20 100 000 2222",
    },
    status: "COMPLETED",
    slot_duration: 30,
    appointment_date: todayLocalDate,
    start_time: toTimeString(Math.min(slotBaseHour + 1, 23), 0),
    end_time: toTimeString(Math.min(slotBaseHour + 1, 23), 30),
  },
  {
    id: "dummy-appt-3",
    clinic: {
      id: "clinic-2",
      name: "Downtown Medical Center",
      address: "456 Healthcare Blvd",
      address_maps_link: null,
    },
    patient: {
      id: "patient-3",
      name: "Khaled Mahmoud",
      gender: "MALE",
      phone: "+20 100 000 3333",
    },
    status: "CONFIRMED",
    slot_duration: 45,
    appointment_date: todayLocalDate,
    start_time: toTimeString(Math.min(slotBaseHour, 23), 0),
    end_time: toTimeString(Math.min(slotBaseHour, 23), 45),
  },
  {
    id: "dummy-appt-4",
    clinic: {
      id: "clinic-2",
      name: "Downtown Medical Center",
      address: "456 Healthcare Blvd",
      address_maps_link: null,
    },
    patient: {
      id: "patient-4",
      name: "Yasmin Omar",
      gender: "FEMALE",
      phone: "+20 100 000 4444",
    },
    status: "CANCELLED",
    slot_duration: 30,
    appointment_date: todayLocalDate,
    start_time: toTimeString(Math.min(slotBaseHour, 23), 0),
    end_time: toTimeString(Math.min(slotBaseHour, 23), 30),
  },
];

export function NurseAppointmentsTab() {
  const t = useTranslations("nurseDashboard");
  const { locale } = useLanguage();
  const [selectedEntry, setSelectedEntry] = useState<NurseScheduleEntry | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const { data: scheduleData, isLoading: isScheduleLoading } =
    useNurseSchedule();
  const scheduleEntries = USE_DUMMY_DATA
    ? DUMMY_SCHEDULE_ENTRIES
    : (scheduleData?.data ?? []);

  const queryParams =
    selectedEntry && !isDialogOpen
      ? {
          doctorId: selectedEntry.doctor.id,
          clinicId: selectedEntry.clinic.id,
          date: format(selectedDate, "yyyy-MM-dd"),
        }
      : null;

  const { data: appointmentsData, isLoading: isAppointmentsLoading } =
    useNurseDashboardAppointments(queryParams);

  const appointments = USE_DUMMY_DATA
    ? DUMMY_APPOINTMENTS.filter(
        (appt) =>
          appt.clinic.id === selectedEntry?.clinic.id &&
          appt.appointment_date === format(selectedDate, "yyyy-MM-dd"),
      )
    : (appointmentsData?.data ?? []);

  const { mutate: completeAppointment } = useCompleteNurseAppointment();

  const handleConfirm = (entry: NurseScheduleEntry, date: Date) => {
    setSelectedEntry(entry);
    setSelectedDate(date);
    setIsDialogOpen(false);
  };

  const handleComplete = (appointmentId: string) => {
    setCompletingId(appointmentId);
    completeAppointment(appointmentId, {
      onSettled: () => setCompletingId(null),
    });
  };

  if (isScheduleLoading && !USE_DUMMY_DATA) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="border rounded-xl p-4 flex items-center gap-3"
            >
              <Skeleton className="h-11 w-11 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-9 w-20 rounded-md shrink-0" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isScheduleLoading && scheduleEntries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <CalendarOff className="h-12 w-12 text-muted-foreground/50" />
        <h2 className="text-xl font-semibold">{t("schedule.noSchedule")}</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          {t("schedule.noScheduleDesc")}
        </p>
      </div>
    );
  }

  return (
    <>
      <AppointmentSelectionDialog
        open={isDialogOpen}
        scheduleEntries={scheduleEntries}
        onConfirm={handleConfirm}
      />

      {!isDialogOpen && selectedEntry && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="mt-1">
              <h1 className="text-2xl font-bold">{t("appointments.title")}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1 flex-wrap">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <Stethoscope className="h-4 w-4" />
                  {selectedEntry.doctor.name}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 font-medium">
                  <Building2 className="h-4 w-4" />
                  {selectedEntry.clinic.name}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  {format(selectedDate, "PPP", {
                    locale: locale === "ar" ? ar : undefined,
                  })}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-1.5"
            >
              <Settings2 className="h-4 w-4" />
              {t("appointments.changePair")}
            </Button>
          </div>

          <Separator />

          {isAppointmentsLoading && !USE_DUMMY_DATA ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <CalendarOff className="h-10 w-10 text-muted-foreground/50" />
              <p className="font-medium">{t("appointments.noAppointments")}</p>
              <p className="text-sm text-muted-foreground max-w-sm">
                {t("appointments.noAppointmentsDesc")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((appt) => {
                const isCompleted = appt.status === "COMPLETED";
                const isCompleting = completingId === appt.id;

                const patientInitials = appt.patient.name
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();

                return (
                  <div
                    key={appt.id}
                    className="flex items-center justify-between gap-4 rounded-xl border p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback>{patientInitials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">
                          {appt.patient.name}
                        </p>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {getTimeIn12HourFormat(
                              appt.start_time,
                              locale,
                            )} – {getTimeIn12HourFormat(appt.end_time, locale)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {appt.patient.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Badge
                        variant={
                          isCompleted
                            ? "secondary"
                            : appt.status === "CONFIRMED"
                              ? "default"
                              : "outline"
                        }
                        className="hidden sm:flex"
                      >
                        {t(`appointments.status.${appt.status}` as any)}
                      </Badge>

                      {!isCompleted && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleComplete(appt.id)}
                          disabled={isCompleting}
                          className="flex items-center gap-1.5"
                        >
                          {isCompleting ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              {t("appointments.completing")}
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {t("appointments.markComplete")}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}
