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

  return (
    <PatientDashboardLayout>
      <OnlineLobbyContainer
        appointmentId={params.appointmentId}
        startAt={startAt}
        routeRole="patient"
      >
        {(props) => <OnlineLobbyPresentational {...props} />}
      </OnlineLobbyContainer>
    </PatientDashboardLayout>
  );
}
