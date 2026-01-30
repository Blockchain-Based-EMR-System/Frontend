"use client";

import { useDoctors } from "../../query/useDoctors.query";
import { DashboardPresentational } from "./DashboardPresentational";

export function DashboardContainer() {
  const { data: doctorsData, isLoading } = useDoctors();

  const doctorsCount = doctorsData?.data?.length || 0;

  return (
    <DashboardPresentational
      doctorsCount={doctorsCount}
      isLoading={isLoading}
    />
  );
}