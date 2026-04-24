"use client";

import { useParams, useSearchParams } from "next/navigation";
import { PatientDashboardLayout } from "@/features/dashboards/dashboard";
import {
  OnlineLobbyContainer,
  OnlineLobbyPresentational,
} from "@/features/appointment-session";

export default function PatientOnlineLobbyPage() {
  const params = useParams<{ appointmentId: string }>();
  const searchParams = useSearchParams();
  const startAt = searchParams.get("startAt");
  const endAt = searchParams.get("endAt");

  return (
    <PatientDashboardLayout>
      <OnlineLobbyContainer
        appointmentId={params.appointmentId}
        startAt={startAt}
        endAt={endAt}
        routeRole="patient"
        doctorName={searchParams.get("doctorName")}
        doctorPhoto={searchParams.get("doctorPhoto")}
      >
        {(props) => <OnlineLobbyPresentational {...props} />}
      </OnlineLobbyContainer>
    </PatientDashboardLayout>
  );
}
