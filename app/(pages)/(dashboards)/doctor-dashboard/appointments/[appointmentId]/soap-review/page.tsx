"use client";

import { useParams } from "next/navigation";
import { DoctorDashboardContainer } from "@/features/dashboards/doctor-dashboard";
import {
  SOAPOfflineContainer,
  SOAPOfflinePresentational,
} from "@/features/appointment-session";

export default function DoctorSoapReviewPage() {
  const params = useParams<{ appointmentId: string }>();

  return (
    <DoctorDashboardContainer>
      <div className="mx-auto w-full max-w-3xl px-4 pb-4">
        <SOAPOfflineContainer appointmentId={params.appointmentId}>
          {(props) => <SOAPOfflinePresentational {...props} />}
        </SOAPOfflineContainer>
      </div>
    </DoctorDashboardContainer>
  );
}
