"use client";

import { useDoctors } from "../../query/useDoctors.query";
import { useClinics } from "../../query/useClinics.query";
import { DashboardPresentational } from "./DashboardPresentational";

export function DashboardContainer() {
  const { data: doctorsData, isLoading: isLoadingDoctors } = useDoctors();
  const { data: clinicsData, isLoading: isLoadingClinics } = useClinics();

  const isLoading = isLoadingDoctors || isLoadingClinics;
  const doctorsCount = doctorsData?.data?.length || 0;
  const clinicsCount = clinicsData?.data?.length || 0;

  return (
    <DashboardPresentational
      doctorsCount={doctorsCount}
      clinicsCount={clinicsCount}
      isLoading={isLoading}
    />
  );
}
