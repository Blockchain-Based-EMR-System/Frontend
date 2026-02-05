"use client";

import {
  DoctorDashboardContainer,
  AppointmentsTab,
} from "@/features/dashboards/doctor-dashboard";

export default function AppointmentsPage() {
  return (
    <DoctorDashboardContainer>
      <AppointmentsTab />
    </DoctorDashboardContainer>
  );
}
