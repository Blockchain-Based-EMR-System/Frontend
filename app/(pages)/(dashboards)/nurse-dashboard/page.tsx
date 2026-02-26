"use client";

import { useTranslations } from "next-intl";
import { NurseDashboardContainer } from "@/features/dashboards/nurse-dashboard";
import { useUserStore } from "@/stores/useUserStore";
import { HeartPulse } from "lucide-react";

export default function NurseDashboardPage() {
  const t = useTranslations("nurseDashboard");
  const { user } = useUserStore();

  return (
    <NurseDashboardContainer>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <HeartPulse className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">
              {t("overview.title")}, {user?.name ?? ""}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("overview.subtitle")}
            </p>
          </div>
        </div>
      </div>
    </NurseDashboardContainer>
  );
}
