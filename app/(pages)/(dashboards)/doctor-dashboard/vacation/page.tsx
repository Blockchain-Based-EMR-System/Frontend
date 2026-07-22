"use client";

import {
  DoctorDashboardContainer,
  VacationTab,
  useClinics,
} from "@/features/dashboards/doctor-dashboard";

export default function VacationPage() {
  const { data: clinicsData } = useClinics();
  const clinics = clinicsData?.data || [];

  return (
    <DoctorDashboardContainer>
      <VacationTab clinics={clinics} />
    </DoctorDashboardContainer>
  );
}
