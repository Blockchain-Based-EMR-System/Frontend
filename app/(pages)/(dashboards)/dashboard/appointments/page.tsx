"use client";

import {
  AppointmentsContainer,
  AppointmentsPresentational,
  PatientDashboardLayout,
} from "@/features/dashboards/dashboard";

export default function AppointmentsPage() {
  return (
    <PatientDashboardLayout>
      <AppointmentsContainer>
        {(props) => <AppointmentsPresentational {...props} />}
      </AppointmentsContainer>
    </PatientDashboardLayout>
  );
}
