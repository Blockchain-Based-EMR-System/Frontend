"use client";

import { useParams, useSearchParams } from "next/navigation";
import { DoctorDashboardContainer } from "@/features/dashboards/doctor-dashboard";
import {
  OnlineLobbyContainer,
  OnlineLobbyPresentational,
} from "@/features/appointment-session";

export default function DoctorOnlineLobbyPage() {
  const params = useParams<{ appointmentId: string }>();
  const searchParams = useSearchParams();
  const startAt = searchParams.get("startAt");
  const endAt = searchParams.get("endAt");

  return (
    <DoctorDashboardContainer>
      <OnlineLobbyContainer
        appointmentId={params.appointmentId}
        startAt={startAt}
        endAt={endAt}
        routeRole="doctor"
        patientName={searchParams.get("patientName")}
        patientPhoto={searchParams.get("patientPhoto")}
      >
        {(props) => <OnlineLobbyPresentational {...props} />}
      </OnlineLobbyContainer>
    </DoctorDashboardContainer>
  );
}
