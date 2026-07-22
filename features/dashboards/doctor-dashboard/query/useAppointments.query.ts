import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDailySchedule,
  getTodaySchedule,
  rescheduleAppointment,
  cancelAppointment,
} from "../api/appointments.api";
import { toast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageProvider";

export const APPOINTMENTS_QUERY_KEY = "doctor-appointments";

export const useDailySchedule = (date: string) => {
  return useQuery({
    queryKey: [APPOINTMENTS_QUERY_KEY, "daily", date],
    queryFn: () => getDailySchedule(date),
    enabled: !!date,
  });
};

export const useTodaySchedule = () => {
  return useQuery({
    queryKey: [APPOINTMENTS_QUERY_KEY, "today"],
    queryFn: getTodaySchedule,
  });
};

export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();
  const { locale } = useLanguage();

  return useMutation({
    mutationFn: ({
      appointmentId,
      minutes,
    }: {
      appointmentId: string;
      minutes: number;
    }) => rescheduleAppointment(appointmentId, { minutes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description:
          locale === "ar"
            ? "تم إعادة جدولة الموعد بنجاح"
            : "Appointment rescheduled successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description:
          error.message ||
          (locale === "ar"
            ? "فشل في إعادة جدولة الموعد"
            : "Failed to reschedule appointment"),
        variant: "destructive",
      });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  const { locale } = useLanguage();

  return useMutation({
    mutationFn: (appointmentId: string) => cancelAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description:
          locale === "ar"
            ? "تم إلغاء الموعد بنجاح"
            : "Appointment cancelled successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description:
          error.message ||
          (locale === "ar"
            ? "فشل في إلغاء الموعد"
            : "Failed to cancel appointment"),
        variant: "destructive",
      });
    },
  });
};
