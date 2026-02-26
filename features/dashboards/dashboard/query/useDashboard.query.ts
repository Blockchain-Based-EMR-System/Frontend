import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  DashboardUser,
  Appointment,
  RescheduleAppointmentRequest,
} from "../types/dashboardTypes";
import { ApiError } from "@/types";
import { useUserStore } from "@/stores/useUserStore";
import {
  getCurrentUser,
  getTodayAppointment,
  getPatientAppointments,
  cancelAppointment,
  rescheduleAppointment,
} from "../api/dashboard.api";
import { toast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageProvider";

export const useDashboard = (): UseQueryResult<DashboardUser, Error> => {
  const user = useUserStore((state) => state.user);
  const hasHydrated = useUserStore((state) => state._hasHydrated);
  const setUser = useUserStore((state) => state.setUser);

  return useQuery({
    queryKey: ["dashboard", "user"],
    queryFn: async () => {
      const userData = await getCurrentUser();
      setUser(userData);
      return userData as DashboardUser;
    },
    enabled: hasHydrated,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    initialData: user ? (user as DashboardUser) : undefined,
  });
};

export const useTodayAppointment = (): UseQueryResult<
  Appointment | null,
  Error
> => {
  return useQuery({
    queryKey: ["appointments", "today"],
    queryFn: getTodayAppointment,
    staleTime: 2 * 60 * 1000, 
    retry: 1,
  });
};

export const usePatientAppointments = (): UseQueryResult<
  Appointment[],
  Error
> => {
  return useQuery({
    queryKey: ["appointments", "patient"],
    queryFn: getPatientAppointments,
    staleTime: 5 * 60 * 1000, 
    retry: 1,
  });
};

export const useCancelAppointment = (): UseMutationResult<
  void,
  AxiosError<ApiError>,
  string
> => {
  const queryClient = useQueryClient();
  const { locale } = useLanguage();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      await cancelAppointment(appointmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });

      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description:
          locale === "ar"
            ? "تم إلغاء الموعد بنجاح"
            : "Appointment cancelled successfully",
      });
    },
    onError: (error) => {
      const errorMessage =
        locale === "en"? error.response?.data?.messageEn : error.response?.data?.messageAr ||
        (locale === "ar" ? "فشل إلغاء الموعد" : "Failed to cancel appointment");

      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useRescheduleAppointment = (): UseMutationResult<
  void,
  AxiosError<ApiError>,
  { appointmentId: string; data: RescheduleAppointmentRequest }
> => {
  const queryClient = useQueryClient();
  const { locale } = useLanguage();

  return useMutation({
    mutationFn: async ({ appointmentId, data }) => {
      await rescheduleAppointment(appointmentId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });

      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description:
          locale === "ar"
            ? "تم إعادة جدولة الموعد بنجاح"
            : "Appointment rescheduled successfully",
      });
    },
    onError: (error) => {
      const errorMessage =
        locale === "en"? error.response?.data?.messageEn : error.response?.data?.messageAr ||
        (locale === "ar"
          ? "فشل إعادة جدولة الموعد"
          : "Failed to reschedule appointment");

      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
