"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Stethoscope, Building2, HeartPulse } from "lucide-react";
import { useTranslations } from "next-intl";

interface DashboardPresentationalProps {
  adminsCount: number;
  doctorsCount: number;
  clinicsCount: number;
  nursesCount: number;
}

export function DashboardPresentational({
  adminsCount,
  doctorsCount,
  clinicsCount,
  nursesCount,
}: DashboardPresentationalProps) {
  const tAdmin = useTranslations("superAdmin");
  const stats = [
    {
      title: "totalAdmins",
      value: adminsCount,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "totalDoctors",
      value: doctorsCount,
      icon: Stethoscope,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "totalClinics",
      value: clinicsCount,
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "totalNurses",
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {tAdmin(stat.title)}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
