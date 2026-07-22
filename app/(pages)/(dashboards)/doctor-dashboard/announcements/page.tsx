"use client";

import {
  DoctorDashboardContainer,
  DoctorAnnouncementsTab,
} from "@/features/dashboards/doctor-dashboard";

export default function AnnouncementsPage() {
  return (
    <DoctorDashboardContainer>
      <DoctorAnnouncementsTab />
    </DoctorDashboardContainer>
  );
}
