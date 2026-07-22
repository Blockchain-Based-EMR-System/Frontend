import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNurseSchedule,
  getNurseAppointments,
  completeNurseAppointment,
} from "../api/nurseDashboard.api";
import { GetNurseAppointmentsParams } from "../types/nurseDashboardTypes";
import { toast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageProvider";

export const NURSE_SCHEDULE_KEY = "nurse-schedule";
export const NURSE_APPOINTMENTS_KEY = "nurse-dashboard-appointments";

export function useNurseSchedule() {
  return useQuery({
    queryKey: [NURSE_SCHEDULE_KEY],
    queryFn: getNurseSchedule,
  });
}

export function useNurseDashboardAppointments(
  params: GetNurseAppointmentsParams | null,
) {
  return useQuery({
    queryKey: [NURSE_APPOINTMENTS_KEY, params],
    queryFn: () => getNurseAppointments(params!),
    enabled: !!params && !!params.doctorId && !!params.date,
  });
}

export function useCompleteNurseAppointment() {
  const queryClient = useQueryClient();
  const { locale } = useLanguage();

  return useMutation({
    mutationFn: (appointmentId: string) =>
      completeNurseAppointment(appointmentId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [NURSE_APPOINTMENTS_KEY] });
      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description: locale === "ar" ? data.messageAr : data.messageEn,
      });
    },
    onError: () => {
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description:
          locale === "ar"
            ? "فشل تحديث الموعد. حاول مرة أخرى."
            : "Failed to complete appointment. Please try again.",
        variant: "destructive",
      });
    },
  });
}
