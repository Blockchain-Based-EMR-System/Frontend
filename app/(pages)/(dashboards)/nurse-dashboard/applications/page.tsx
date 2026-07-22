"use client";

import {
  NurseDashboardContainer,
  ApplicationsTab,
} from "@/features/dashboards/nurse-dashboard";

export default function ApplicationsPage() {
  return (
    <NurseDashboardContainer>
      <ApplicationsTab />
    </NurseDashboardContainer>
  );
}
