"use client";

import {
  MedicalHistoryContainer,
  MedicalHistoryPresentational,
  PatientDashboardLayout,
} from "@/features/dashboards/dashboard";

export default function MedicalHistoryPage() {
  return (
    <PatientDashboardLayout>
      <MedicalHistoryContainer>
        {(props) => <MedicalHistoryPresentational {...props} />}
      </MedicalHistoryContainer>
    </PatientDashboardLayout>
  );
}
