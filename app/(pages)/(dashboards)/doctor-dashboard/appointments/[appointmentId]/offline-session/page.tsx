"use client";

import { useParams, useSearchParams } from "next/navigation";
import { DoctorDashboardContainer } from "@/features/dashboards/doctor-dashboard";
import {
  OfflineSessionContainer,
  OfflineSessionPresentational,
  SOAPOfflineContainer,
  SOAPOfflinePresentational,
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
      <div className="mx-auto w-full max-w-3xl px-4 pb-4">
        <SOAPOfflineContainer appointmentId={params.appointmentId}>
          {(props) => <SOAPOfflinePresentational {...props} />}
        </SOAPOfflineContainer>
      </div>
      
    </DoctorDashboardContainer>
  );
}
