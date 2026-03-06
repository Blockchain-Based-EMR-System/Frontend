"use client";

import {
  NurseDashboardContainer,
  ScheduleTab,
} from "@/features/dashboards/nurse-dashboard";

export default function SchedulePage() {
  return (
    <NurseDashboardContainer>
      <ScheduleTab />
    </NurseDashboardContainer>
  );
}
