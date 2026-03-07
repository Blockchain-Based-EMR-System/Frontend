"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useSocketEvent } from "@/hooks/useSocketEvent";
import { useToast } from "@/hooks/useToast";
import { APPOINTMENTS_QUERY_KEY } from "../query/useAppointments.query";

interface AppointmentStatusChangedPayload {
  appointmentId: string;
  newStatus: "CONFIRMED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED";
  doctorId: string;
  patientId: string;
  patientName: string;
  appointmentDate: string;
  startTime: string;
}

interface DoctorInitialData {
  schedule: unknown[];
}

export function useDoctorSocket() {
  const queryClient = useQueryClient();
  const t = useTranslations("doctorDashboard");
  const { toast } = useToast();

  const handleStatusChanged = useCallback(
    (data: AppointmentStatusChangedPayload) => {
      queryClient.invalidateQueries({
        queryKey: [APPOINTMENTS_QUERY_KEY],
      });

      if (data.newStatus === "CANCELLED") {
        toast({
          title: t("socket.patientCancelled", {
            patient: data.patientName,
            date: data.appointmentDate,
          }),
          variant: "destructive",
        });
      } else if (data.newStatus === "RESCHEDULED") {
        toast({
          title: t("socket.patientRescheduled", {
            patient: data.patientName,
          }),
        });
      } else if (data.newStatus === "COMPLETED") {
        toast({
          title: t("socket.appointmentCompleted"),
        });
      }
    },
    [queryClient, t, toast],
  );

  const handleInitialData = useCallback(
    (_data: DoctorInitialData) => {
      queryClient.invalidateQueries({
        queryKey: [APPOINTMENTS_QUERY_KEY],
      });
    },
    [queryClient],
  );

  useSocketEvent<AppointmentStatusChangedPayload>(
    "appointment_status_changed",
    handleStatusChanged,
  );
  useSocketEvent<DoctorInitialData>("initial_data", handleInitialData);
}
