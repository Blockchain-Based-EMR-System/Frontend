"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Building2, HeartPulse } from "lucide-react";
import { useTranslations } from "next-intl";

interface DashboardPresentationalProps {
  doctorsCount: number;
  clinicsCount: number;
  nursesCount: number;
  isLoading: boolean;
}

export function DashboardPresentational({
  doctorsCount,
  clinicsCount,
  nursesCount,
  isLoading,
}: DashboardPresentationalProps) {
  const tAdmin = useTranslations("admin");

  const stats = [
    {
      titleKey: "totalDoctors",
      value: doctorsCount,
      icon: Stethoscope,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      titleKey: "totalClinics",
      value: clinicsCount,
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      titleKey: "totalNurses",
      value: nursesCount,
      icon: HeartPulse,
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/20",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {tAdmin("dashboard")}
        </h1>
        <p className="text-muted-foreground">{tAdmin("welcomeToDashboard")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.titleKey}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {tAdmin(stat.titleKey)}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
