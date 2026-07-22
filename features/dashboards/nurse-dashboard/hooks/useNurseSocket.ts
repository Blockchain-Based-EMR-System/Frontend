"use client";

import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useSocketEvent } from "@/hooks/useSocketEvent";
import { useSocket } from "@/contexts/SocketProvider";
import { useToast } from "@/hooks/useToast";
import { NURSE_APPOINTMENTS_KEY } from "../query/useNurseDashboard.query";

interface AppointmentStatusChangedPayload {
  appointmentId: string;
  newStatus: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  appointmentDate: string;
  startTime: string;
}

interface NurseInitialData {
  appointments: unknown[];
}

export function useNurseSocket() {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const t = useTranslations("nurseDashboard");
  const { toast } = useToast();

  const handleStatusChanged = useCallback(
    (data: AppointmentStatusChangedPayload) => {
      queryClient.invalidateQueries({
        queryKey: [NURSE_APPOINTMENTS_KEY],
      });

      const knownStatuses = ["CONFIRMED", "COMPLETED", "CANCELLED", "PENDING"];
      const statusLabel = knownStatuses.includes(data.newStatus)
        ? t(`appointments.status.${data.newStatus}` as Parameters<typeof t>[0])
        : data.newStatus;

      toast({
        title: t("socket.appointmentStatusChanged", {
          id: data.appointmentId.slice(-6),
          status: statusLabel,
        }),
      });
    },
    [queryClient, t, toast],
  );

  const handleInitialData = useCallback(
    (_data: NurseInitialData) => {
      queryClient.invalidateQueries({
        queryKey: [NURSE_APPOINTMENTS_KEY],
      });
    },
    [queryClient],
  );

  useSocketEvent<AppointmentStatusChangedPayload>(
    "appointment_status_changed",
    handleStatusChanged,
  );
  useSocketEvent<NurseInitialData>("initial_data", handleInitialData);

  useEffect(() => {
    if (!socket) return;
    socket.emit("request_initial_data");
  }, [socket]);
}
