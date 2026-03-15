"use client";

import { useParams, useSearchParams } from "next/navigation";
import { DoctorDashboardContainer } from "@/features/dashboards/doctor-dashboard";
import {
  OfflineSessionContainer,
  OfflineSessionPresentational,
} from "@/features/appointment-session";

export default function DoctorOfflineSessionPage() {
  const params = useParams<{ appointmentId: string }>();
  const searchParams = useSearchParams();
  const startAt = searchParams.get("startAt");

  return (
    <DoctorDashboardContainer>
      <OfflineSessionContainer
        appointmentId={params.appointmentId}
        startAt={startAt}
      >
        {(props) => <OfflineSessionPresentational {...props} />}
      </OfflineSessionContainer>
    </DoctorDashboardContainer>
  );
}
