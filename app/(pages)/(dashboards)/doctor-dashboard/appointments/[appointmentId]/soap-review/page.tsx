"use client";

import { useParams } from "next/navigation";
import { DoctorDashboardContainer } from "@/features/dashboards/doctor-dashboard";
import {
  SoapReviewContainer,
  SoapReviewPresentational,
} from "@/features/appointment-session";

export default function DoctorSoapReviewPage() {
  const params = useParams<{ appointmentId: string }>();

  return (
    <DoctorDashboardContainer>
      <SoapReviewContainer appointmentId={params.appointmentId}>
        {(props) => <SoapReviewPresentational {...props} />}
      </SoapReviewContainer>
    </DoctorDashboardContainer>
  );
}
