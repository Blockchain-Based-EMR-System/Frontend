import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  getSchedule,
  createMultipleSchedules,
  updateSchedule,
  getVacations,
  clearVacation,
  cancelVacation,
} from "../api/schedule.api";
import {
  GetScheduleResponse,
  CreateScheduleRequest,
  CreateScheduleResponse,
  UpdateScheduleRequest,
  UpdateScheduleResponse,
  GetVacationsResponse,
  ClearVacationRequest,
  ClearVacationResponse,
  CancelVacationRequest,
  CancelVacationResponse,
} from "../types/schedule.types";
import { ApiError } from "@/types";
import { toast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageProvider";

export const scheduleKeys = {
  all: ["schedule"] as const,
  current: ["schedule", "current"] as const,
  vacations: ["schedule", "vacations"] as const,
};

export const useSchedule = (): UseQueryResult<
  GetScheduleResponse,
  AxiosError<ApiError>
> => {
  return useQuery({
    queryKey: scheduleKeys.all,
    queryFn: getSchedule,
  });
};

export const useCreateSchedules = (): UseMutationResult<
  CreateScheduleResponse[],
  AxiosError<ApiError>,
  CreateScheduleRequest[]
> => {
  const { locale } = useLanguage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMultipleSchedules,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });

      const successMessage =
        locale === "ar" ? "تم حفظ الجدول بنجاح" : "Schedule saved successfully";

      toast({
        title: locale === "ar" ? "نجاح" : "Success",
        description: successMessage,
      });
    },
    onError: (error: any) => {
      console.error("Schedule creation error:", error);
      console.error("Error response:", error.response?.data);

      const errorMessage =
        locale === "ar"
          ? error.response?.data?.messageAr || "فشل حفظ الجدول"
          : error.response?.data?.messageEn || "Failed to save schedule";

      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSchedule = (): UseMutationResult<
  UpdateScheduleResponse,
  AxiosError<ApiError>,
  UpdateScheduleRequest
> => {
  const { locale } = useLanguage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });

      const successMessage =
        locale === "ar"
          ? "تم تحديث الجدول بنجاح"
          : "Schedule updated successfully";

      toast({
        title: locale === "ar" ? "نجاح" : "Success",
        description: successMessage,
      });
    },
    onError: (error: any) => {
      console.error("Schedule update error:", error);
      console.error("Error response:", error.response?.data);

      const errorMessage =
        locale === "ar"
          ? error.response?.data?.messageAr || "فشل تحديث الجدول"
          : error.response?.data?.messageEn || "Failed to update schedule";

      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useVacations = (): UseQueryResult<
  GetVacationsResponse,
  AxiosError<ApiError>
> => {
  return useQuery({
    queryKey: scheduleKeys.vacations,
    queryFn: getVacations,
  });
};

export const useClearVacation = (): UseMutationResult<
  ClearVacationResponse,
  AxiosError<ApiError>,
  ClearVacationRequest
> => {
  const { locale } = useLanguage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearVacation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.vacations });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });

      const successMessage =
        locale === "ar"
          ? "تم إلغاء الإجازة بنجاح"
          : "Vacation cleared successfully";

      toast({
        title: locale === "ar" ? "نجاح" : "Success",
        description: successMessage,
      });
    },
    onError: (error: any) => {
      console.error("Clear vacation error:", error);

      const errorMessage =
        locale === "ar"
          ? error.response?.data?.message?.ar || "فشل إلغاء الإجازة"
          : error.response?.data?.message?.en || "Failed to clear vacation";

      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useCancelVacation = (): UseMutationResult<
  CancelVacationResponse,
  AxiosError<ApiError>,
  CancelVacationRequest
> => {
  const { locale } = useLanguage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelVacation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.vacations });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });

      const successMessage =
        locale === "ar"
          ? "تم إلغاء الإجازة بنجاح"
          : "Vacation cancelled successfully";

      toast({
        title: locale === "ar" ? "نجاح" : "Success",
        description: successMessage,
      });
    },
    onError: (error: any) => {
      console.error("Cancel vacation error:", error);

      const errorMessage =
        locale === "ar"
          ? error.response?.data?.messageAr || "فشل إلغاء الإجازة"
          : error.response?.data?.messageEn || "Failed to cancel vacation";

      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
