"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { usePatientAppointments } from "../../query/useDashboard.query";
import { Appointment } from "../../types/dashboardTypes";

export interface AppointmentsContainerProps {
  children: (props: AppointmentsPresentationalProps) => React.ReactNode;
}

export type ViewMode = "upcoming" | "history";

export interface AppointmentsPresentationalProps {
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  isLoading: boolean;
  isError: boolean;
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  tDashboard: (key: string) => string;
  tCommon: (key: string) => string;
}

export function AppointmentsContainer({
  children,
}: AppointmentsContainerProps) {
  const tDashboard = useTranslations("userDashboard");
  const tCommon = useTranslations("common");
  const [activeView, setActiveView] = useState<ViewMode>("upcoming");

  const { data: appointments, isLoading, isError } = usePatientAppointments();

  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    if (!appointments) {
      return { upcomingAppointments: [], pastAppointments: [] };
    }

    console.log("📅 All appointments:", appointments);

    const now = new Date();
    const upcoming: Appointment[] = [];
    const past: Appointment[] = [];

    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.scheduledTime);
      const isPastDate = appointmentDate < now;

      if (appointment.status === "CONFIRMED" && !isPastDate) {
        upcoming.push(appointment);
      } else {
        past.push(appointment);
      }
    });

    console.log("📅 Upcoming appointments:", upcoming);
    console.log("📅 Past appointments:", past);

    upcoming.sort(
      (a, b) =>
        new Date(a.scheduledTime).getTime() -
        new Date(b.scheduledTime).getTime(),
    );

    past.sort(
      (a, b) =>
        new Date(b.scheduledTime).getTime() -
        new Date(a.scheduledTime).getTime(),
    );

    return { upcomingAppointments: upcoming, pastAppointments: past };
  }, [appointments]);

  return (
    <>
      {children({
        upcomingAppointments,
        pastAppointments,
        isLoading,
        isError,
        activeView,
        setActiveView,
        tDashboard,
        tCommon,
      })}
    </>
  );
}
