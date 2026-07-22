"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList, Building2, Stethoscope } from "lucide-react";
import { useTranslations } from "next-intl";
import { useNurseApplications } from "@/features/join/nurse";
import { useNurseSchedule } from "../query/useNurseDashboard.query";

function NurseDashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1.5" />
            <Skeleton className="h-3 w-36" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function NurseDashboardStats() {
  const t = useTranslations("nurseDashboard");

  const { data: appsData, isLoading: isLoadingApps } = useNurseApplications();
  const { data: scheduleData, isLoading: isLoadingSchedule } =
    useNurseSchedule();

  if (isLoadingApps || isLoadingSchedule) {
    return <NurseDashboardStatsSkeleton />;
  }

  const applications = appsData?.data ?? [];
  const schedule = scheduleData?.data ?? [];

  const approvedCount = applications.filter(
    (a) => a.application_status === "APPROVED",
  ).length;
  const uniqueClinicsCount = new Set(schedule.map((e) => e.clinic.id)).size;
  const uniqueDoctorsCount = new Set(schedule.map((e) => e.doctor.id)).size;

  const stats = [
    {
      titleKey: "stats.totalApplications" as const,
      value: applications.length,
      desc: t("stats.approvedCount", { count: approvedCount }),
      icon: ClipboardList,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      titleKey: "stats.clinicsCount" as const,
      value: uniqueClinicsCount,
      desc: "",
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      titleKey: "stats.doctorsCount" as const,
      value: uniqueDoctorsCount,
      desc: "",
      icon: Stethoscope,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.titleKey}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t(stat.titleKey)}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
