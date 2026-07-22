"use client";

import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useSocketEvent } from "@/hooks/useSocketEvent";
import { useSocket } from "@/contexts/SocketProvider";
import { useToast } from "@/hooks/useToast";
import { useQueueStore } from "@/stores/useQueueStore";

interface AppointmentStatusChangedPayload {
  appointmentId: string;
  newStatus: "CONFIRMED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED";
  doctorId: string;
  patientId: string;
  patientName: string;
  appointmentDate: string;
  startTime: string;
}

interface QueueUpdatedPayload {
  appointmentId: string;
  position: number;
  estimatedWaitMinutes: number;
}

interface PatientInitialData {
  appointments: Array<{
    id: string;
    status: string;
    queuePosition: { position: number; estimatedWaitMinutes: number } | null;
  }>;
}

export function usePatientSocket() {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const t = useTranslations("userDashboard");
  const { toast } = useToast();

  const handleStatusChanged = useCallback(
    (data: AppointmentStatusChangedPayload) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });

      if (data.newStatus === "CANCELLED") {
        toast({
          title: t("socket.appointmentCancelled"),
          variant: "destructive",
        });
      } else if (data.newStatus === "RESCHEDULED") {
        toast({ title: t("socket.appointmentRescheduled") });
      } else if (data.newStatus === "COMPLETED") {
        toast({ title: t("socket.appointmentCompleted") });
      }
    },
    [queryClient, t, toast],
  );

  const handleQueueUpdated = useCallback(
    (data: QueueUpdatedPayload) => {
      useQueueStore.getState().update(data.appointmentId, {
        position: data.position,
        estimatedWaitMinutes: data.estimatedWaitMinutes,
      });
      toast({
        title: t("socket.queueUpdated"),
        description: t("socket.queuePosition", { position: data.position }),
      });
    },
    [t, toast],
  );

  const handleInitialData = useCallback(
    (data: PatientInitialData) => {
      console.log(
        "[socket] initial_data received:",
        JSON.stringify(data, null, 2),
      );
      if (data.appointments) {
        for (const app of data.appointments) {
          if (app.queuePosition) {
            useQueueStore.getState().update(app.id, app.queuePosition);
          }
        }
      }
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    [queryClient],
  );

  useSocketEvent<AppointmentStatusChangedPayload>(
    "appointment_status_changed",
    handleStatusChanged,
  );
  useSocketEvent<QueueUpdatedPayload>("queue_updated", handleQueueUpdated);
  useSocketEvent<PatientInitialData>("initial_data", handleInitialData);

  useEffect(() => {
    if (!socket) return;
    console.log(
      "[socket] emitting request_initial_data, connected:",
      socket.connected,
    );
    socket.emit("request_initial_data");
  }, [socket]);
}
