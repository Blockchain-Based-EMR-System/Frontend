"use client";

import { useDoctors } from "../../query/useDoctors.query";
import { useClinics } from "../../query/useClinics.query";
import { useAllNurses } from "../../query/useNurses.query";
import { DashboardPresentational } from "./DashboardPresentational";
import { DashboardSkeleton } from "../../skeletons/DashboardSkeleton";

export function DashboardContainer() {
  const { data: doctorsData, isLoading: isLoadingDoctors } = useDoctors();
  const { data: clinicsData, isLoading: isLoadingClinics } = useClinics();
  const { data: nursesData, isLoading: isLoadingNurses } = useAllNurses();

  const isLoading = isLoadingDoctors || isLoadingClinics || isLoadingNurses;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const doctorsCount = doctorsData?.data?.length || 0;
  const clinicsCount = clinicsData?.data?.length || 0;
  const nursesCount = nursesData?.data?.length || 0;

  return (
    <DashboardPresentational
      doctorsCount={doctorsCount}
      clinicsCount={clinicsCount}
      nursesCount={nursesCount}
      isLoading={false}
    />
  );
}
