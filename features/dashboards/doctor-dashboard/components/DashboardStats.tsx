"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar, CalendarCheck } from "lucide-react";
import { useClinics } from "../query/useClinics.query";
import { useSchedule } from "../query/useSchedule.query";
import { useTodaySchedule } from "../query/useAppointments.query";

export function DashboardStats() {
  const t = useTranslations("doctorDashboard.stats");
  const tCommon = useTranslations("common");

  const { data: clinicsData, isLoading: isLoadingClinics } = useClinics();
  const clinics = clinicsData?.data || [];

  const { data: scheduleData, isLoading: isLoadingSchedule } = useSchedule();
  const scheduleEntries = scheduleData?.data || [];

  const { data: appointmentsData, isLoading: isLoadingAppointments } =
    useTodaySchedule();
  const todayAppointments = appointmentsData?.data || [];

  const activeClinicsCount = clinics.filter((c) => c.is_active).length;
  const inactiveClinicsCount = clinics.filter((c) => !c.is_active).length;

  const uniqueDays = new Set(
    scheduleEntries
      .filter((entry: any) => entry.isActive)
      .map((entry: any) => entry.dayOfWeek),
  );
  const workingDaysCount = uniqueDays.size;

  const todayAppointmentsCount = todayAppointments.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            {t("myClinics")}
          </CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoadingClinics ? (
            <div className="text-2xl font-bold">{tCommon("loading")}</div>
          ) : (
            <>
              <div className="text-2xl font-bold">{clinics.length}</div>
              <p className="text-xs text-muted-foreground">
                {t("activeClinics", { count: activeClinicsCount })}
                {inactiveClinicsCount > 0 &&
                  ` • ${t("inactiveClinics", { count: inactiveClinicsCount })}`}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{t("schedule")}</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoadingSchedule ? (
            <div className="text-2xl font-bold">{tCommon("loading")}</div>
          ) : (
            <>
              <div className="text-2xl font-bold">{workingDaysCount}</div>
              <p className="text-xs text-muted-foreground">
                {t("workingDays")}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{t("today")}</CardTitle>
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoadingAppointments ? (
            <div className="text-2xl font-bold">{tCommon("loading")}</div>
          ) : (
            <>
              <div className="text-2xl font-bold">{todayAppointmentsCount}</div>
              <p className="text-xs text-muted-foreground">
                {t("appointments")}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
