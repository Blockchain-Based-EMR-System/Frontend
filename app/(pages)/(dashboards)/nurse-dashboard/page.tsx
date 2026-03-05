"use client";

import { useTranslations } from "next-intl";
import {
  NurseDashboardContainer,
  NurseDashboardStats,
} from "@/features/dashboards/nurse-dashboard";

export default function NurseDashboardPage() {
  const t = useTranslations("nurseDashboard");

  return (
    <NurseDashboardContainer>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("dashboard")}
        </h1>

        <NurseDashboardStats />
      </div>
    </NurseDashboardContainer>
  );
}
