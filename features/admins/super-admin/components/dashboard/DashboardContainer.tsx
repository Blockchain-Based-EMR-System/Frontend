"use client";

import { useAdmins } from "../../query/useAdmin.query";
import { useDoctors } from "../../query/useDoctor.query";
import { useClinics } from "../../query/useClinic.query";
import { useNurses } from "../../query/useNurse.query";
import { DashboardPresentational } from "./DashboardPresentational";
import { DashboardSkeleton } from "../skeletons";

export function DashboardContainer() {
  const { data: adminsData, isLoading: isLoadingAdmins } = useAdmins();
  const { data: doctorsData, isLoading: isLoadingDoctors } = useDoctors();
  const { data: clinicsData, isLoading: isLoadingClinics } = useClinics();
  const { data: nursesData, isLoading: isLoadingNurses } = useNurses();

  const isLoading =
    isLoadingAdmins || isLoadingDoctors || isLoadingClinics || isLoadingNurses;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const adminsCount = adminsData?.data?.length || 0;
  const doctorsCount = doctorsData?.data?.length || 0;
  const clinicsCount = clinicsData?.data?.length || 0;
  const nursesCount = nursesData?.data?.length || 0;

  return (
    <DashboardPresentational
      adminsCount={adminsCount}
      doctorsCount={doctorsCount}
      clinicsCount={clinicsCount}
      nursesCount={nursesCount}
    />
  );
}
