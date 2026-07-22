"use client";

import { useTranslations } from "next-intl";
import {
  DoctorDashboardContainer,
  DashboardStats,
} from "@/features/dashboards/doctor-dashboard";

export default function DoctorDashboardPage() {
  const t = useTranslations("doctorDashboard");

  return (
    <DoctorDashboardContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
        </div>

        <DashboardStats />
      </div>
    </DoctorDashboardContainer>
  );
}
