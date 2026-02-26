"use client";

import {
  NurseDashboardContainer,
  NurseAppointmentsTab,
} from "@/features/dashboards/nurse-dashboard";

export default function AppointmentsPage() {
  return (
    <NurseDashboardContainer>
      <NurseAppointmentsTab />
    </NurseDashboardContainer>
  );
}
