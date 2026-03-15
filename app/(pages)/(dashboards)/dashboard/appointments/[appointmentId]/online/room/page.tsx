"use client";

import { useParams, useSearchParams } from "next/navigation";
import { PatientDashboardLayout } from "@/features/dashboards/dashboard";
import {
  OnlineRoomContainer,
  OnlineRoomPresentational,
} from "@/features/appointment-session";

const parseBoolean = (value: string | null, fallback: boolean) => {
  if (value === null) return fallback;
  return value === "true";
};

export default function PatientOnlineRoomPage() {
  const params = useParams<{ appointmentId: string }>();
  const searchParams = useSearchParams();

  return (
    <PatientDashboardLayout>
      <OnlineRoomContainer
        appointmentId={params.appointmentId}
        routeRole="patient"
        startAt={searchParams.get("startAt")}
        initialMicId={searchParams.get("mic")}
        initialCamId={searchParams.get("cam")}
        initialMicOn={parseBoolean(searchParams.get("micOn"), true)}
        initialCamOn={parseBoolean(searchParams.get("camOn"), true)}
      >
        {(props) => <OnlineRoomPresentational {...props} />}
      </OnlineRoomContainer>
    </PatientDashboardLayout>
  );
}
