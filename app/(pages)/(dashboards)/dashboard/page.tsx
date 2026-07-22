"use client";

import {
  DashboardContainer,
  DashboardPresentational,
  PatientDashboardLayout,
} from "@/features/dashboards/dashboard";

export default function DashboardPage() {
  return (
    <PatientDashboardLayout>
      <DashboardContainer>
        {(props) => <DashboardPresentational {...props} />}
      </DashboardContainer>
    </PatientDashboardLayout>
  );
}
