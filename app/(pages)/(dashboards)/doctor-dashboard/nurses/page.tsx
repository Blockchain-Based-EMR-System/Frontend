"use client";

import {
  DoctorDashboardContainer,
  NursesTab,
} from "@/features/dashboards/doctor-dashboard";

export default function NursesPage() {
  return (
    <DoctorDashboardContainer>
      <NursesTab />
    </DoctorDashboardContainer>
  );
}
