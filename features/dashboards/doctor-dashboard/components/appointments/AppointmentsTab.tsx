"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Building2,
  Video,
} from "lucide-react";
import { useDailySchedule } from "../../query/useAppointments.query";
import { AppointmentCard } from "@/features/dashboards/doctor-dashboard/components/appointments/AppointmentCard";
import { DatePickerPopover } from "@/components/common/DatePickerPopover";
import { useLanguage } from "@/contexts/LanguageProvider";
import { AppointmentsTabSkeleton } from "../skeletons";
import { Appointment } from "../../types/appointment.types";

const USE_DUMMY_DATA = false;

const DUMMY_APPOINTMENTS: Appointment[] = [
  {
    id: "dummy-1",
    status: "CONFIRMED",
    slot_duration: 30,
    patient_name: "Ahmed Hassan",
    appointment_date: new Date().toISOString().split("T")[0],
    start_time: "09:00",
    end_time: "09:30",
    clinic_name: "Main Street Clinic",
    clinic_address: "123 Main St, Downtown",
    isOnline: false,
    bufferTime: 10,
  },
  {
    id: "dummy-2",
    status: "CONFIRMED",
    slot_duration: 45,
    patient_name: "Sarah Mohammed",
    appointment_date: new Date().toISOString().split("T")[0],
    start_time: "10:00",
    end_time: "10:45",
    clinic_name: null,
    clinic_address: null,
    isOnline: true,
    bufferTime: 15,
  },
  {
    id: "dummy-3",
    status: "COMPLETED",
    slot_duration: 30,
    patient_name: "Omar Ali",
    appointment_date: new Date().toISOString().split("T")[0],
    start_time: "08:00",
    end_time: "08:30",
    clinic_name: "Downtown Medical Center",
    clinic_address: "456 Healthcare Blvd",
    isOnline: false,
    bufferTime: 10,
  },
  {
    id: "dummy-4",
    status: "CONFIRMED",
    slot_duration: 60,
    patient_name: "Fatima Ibrahim",
    appointment_date: new Date().toISOString().split("T")[0],
    start_time: "14:00",
    end_time: "15:00",
    clinic_name: null,
    clinic_address: null,
    isOnline: true,
    bufferTime: 15,
  },
  {
    id: "dummy-5",
    status: "CANCELLED",
    slot_duration: 30,
    patient_name: "Khaled Mahmoud",
    appointment_date: new Date().toISOString().split("T")[0],
    start_time: "15:30",
    end_time: "16:00",
    clinic_name: "City Health Clinic",
    clinic_address: "789 Medical Plaza",
    isOnline: false,
    bufferTime: 10,
  },
  {
    id: "dummy-6",
    status: "CONFIRMED",
    slot_duration: 45,
    patient_name: "Layla Youssef",
    appointment_date: new Date().toISOString().split("T")[0],
    start_time: "16:30",
    end_time: "17:15",
    clinic_name: "Main Street Clinic",
    clinic_address: "123 Main St, Downtown",
    isOnline: false,
    bufferTime: 15,
  },
  {
    id: "dummy-7",
    status: "COMPLETED",
    slot_duration: 30,
    patient_name: "Yasmin Ahmed",
    appointment_date: new Date().toISOString().split("T")[0],
    start_time: "11:00",
    end_time: "11:30",
    clinic_name: null,
    clinic_address: null,
    isOnline: true,
    bufferTime: 10,
  },
];

interface AppointmentsTabProps {}

export function AppointmentsTab({}: AppointmentsTabProps) {
  const t = useTranslations("doctorDashboard.appointments");
  const { locale } = useLanguage();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formattedDate = formatDateForAPI(selectedDate);

  const { data, isLoading, isError } = useDailySchedule(formattedDate);

  const rawAppointments = USE_DUMMY_DATA
    ? DUMMY_APPOINTMENTS
    : data?.data || [];

  const appointments = [...rawAppointments].sort((a, b) => {
    if (a.status === "COMPLETED" && b.status !== "COMPLETED") return -1;
    if (a.status !== "COMPLETED" && b.status === "COMPLETED") return 1;

    return a.start_time.localeCompare(b.start_time);
  });

  const formatDateForDisplay = (date: Date): string => {
    if (locale === "ar") {
      return new Intl.DateTimeFormat("ar-EG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    }
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const navigateToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const navigateToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const isToday =
    formatDateForAPI(selectedDate) === formatDateForAPI(new Date());

  if (isLoading && !USE_DUMMY_DATA) {
    return <AppointmentsTabSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">{t("title")}</h2>

        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Video className="h-4 w-4" />
            <span>{t("online")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4" />
            <span>{t("offline")}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={navigateToPreviousDay}
            >
              {locale === "en" ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <div className="min-w-[250px] text-center">
              <p className="font-semibold">
                {formatDateForDisplay(selectedDate)}
              </p>
              {isToday && (
                <p className="text-sm text-muted-foreground">{t("today")}</p>
              )}
            </div>
            <Button variant="outline" size="icon" onClick={navigateToNextDay}>
              {locale === "en" ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          <DatePickerPopover
            date={selectedDate}
            onDateChange={(date) => date && setSelectedDate(date)}
            placeholder={t("selectDate")}
          />
        </div>
      </div>

      {isError && !USE_DUMMY_DATA ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">{t("errorLoading")}</p>
          </CardContent>
        </Card>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t("noAppointments")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("noAppointmentsDesc")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              selectedDate={formattedDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
