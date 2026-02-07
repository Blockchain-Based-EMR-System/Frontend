"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Building2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface DashboardPresentationalProps {
  doctorsCount: number;
  clinicsCount: number;
  isLoading: boolean;
}

export function DashboardPresentational({
  doctorsCount,
  clinicsCount,
  isLoading,
}: DashboardPresentationalProps) {
  const tAdmin = useTranslations("admin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {tAdmin("dashboard")}
        </h1>
        <p className="text-muted-foreground">{tAdmin("welcomeToDashboard")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {tAdmin("totalDoctors")}
            </CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
              <Stethoscope className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : doctorsCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {tAdmin("totalClinics")}
            </CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Building2 className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : clinicsCount}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
