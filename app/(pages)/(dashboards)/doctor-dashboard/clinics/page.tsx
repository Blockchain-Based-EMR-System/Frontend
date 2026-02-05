"use client";

import {
  DoctorDashboardContainer,
  ClinicsTab,
  useClinics,
} from "@/features/dashboards/doctor-dashboard";

export default function ClinicsPage() {
  const { data: clinicsData, isLoading } = useClinics();

  return (
    <DoctorDashboardContainer>
      <ClinicsTab clinics={clinicsData?.data || []} isLoading={isLoading} />
    </DoctorDashboardContainer>
  );
}
