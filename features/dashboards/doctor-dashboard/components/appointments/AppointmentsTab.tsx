"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useDailySchedule } from "../../query/useAppointments.query";
import { AppointmentCard } from "@/features/dashboards/doctor-dashboard/components/appointments/AppointmentCard";
import { DatePickerPopover } from "@/components/common/DatePickerPopover";
import { useLanguage } from "@/contexts/LanguageProvider";

interface AppointmentsTabProps {}

export function AppointmentsTab({}: AppointmentsTabProps) {
  const t = useTranslations("doctorDashboard.appointments");
  const tCommon = useTranslations("common");
  const { locale } = useLanguage();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const formatDateForAPI = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const formattedDate = formatDateForAPI(selectedDate);

  const { data, isLoading, isError } = useDailySchedule(formattedDate);

  const appointments = data?.data || [];

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

  return (
    <div className="space-y-6">
      {/* Header with Date Navigation */}
      <div>
        <h2 className="text-2xl font-bold mb-4">{t("title")}</h2>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={navigateToPreviousDay}
            >
              <ChevronLeft className="h-4 w-4" />
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
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <DatePickerPopover
            date={selectedDate}
            onDateChange={(date) => date && setSelectedDate(date)}
            placeholder={t("selectDate")}
          />
        </div>
      </div>

      {/* Appointments Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">{tCommon("loading")}</p>
        </div>
      ) : isError ? (
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
