"use client";

import {
  DoctorDashboardContainer,
  ScheduleTab,
  useClinics,
} from "@/features/dashboards/doctor-dashboard";

export default function SchedulePage() {
  const { data: clinicsData } = useClinics();

  return (
    <DoctorDashboardContainer>
      <ScheduleTab clinics={clinicsData?.data || []} />
    </DoctorDashboardContainer>
  );
}
