import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  getDoctors,
  getClinics,
  getClinicDoctors,
  getAvailableDays,
  getAvailableSlots,
  bookAppointment,
} from "../api/appointments.api";
import {
  DoctorsResponse,
  ClinicsResponse,
  ClinicDoctorsResponse,
  AvailableDaysResponse,
  AvailableSlotsResponse,
  BookAppointmentRequest,
  BookAppointmentResponse,
  DoctorFilters,
  ClinicFilters,
} from "../types/appointments.types";
import { ApiError } from "@/types";
import { toast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageProvider";

export const useDoctors = (
  filters?: DoctorFilters,
): UseQueryResult<DoctorsResponse, AxiosError<ApiError>> => {
  const { locale } = useLanguage();

  return useQuery({
    queryKey: ["doctors", locale, filters],
    queryFn: () => getDoctors(locale, filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useClinics = (
  filters?: ClinicFilters,
): UseQueryResult<ClinicsResponse, AxiosError<ApiError>> => {
  const { locale } = useLanguage();

  return useQuery({
    queryKey: ["clinics", locale, filters],
    queryFn: () => getClinics(locale, filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useClinicDoctors = (
  clinicId: string,
  filters?: Pick<DoctorFilters, "gender" | "minFees" | "maxFees">,
): UseQueryResult<ClinicDoctorsResponse, AxiosError<ApiError>> => {
  return useQuery({
    queryKey: ["clinic-doctors", clinicId, filters],
    queryFn: () => getClinicDoctors(clinicId, filters),
    enabled: !!clinicId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAvailableDays = (
  doctorId: string,
  clinicId?: string | null,
): UseQueryResult<AvailableDaysResponse, AxiosError<ApiError>> => {
  return useQuery({
    queryKey: ["available-days", doctorId, clinicId],
    queryFn: () => getAvailableDays(doctorId, clinicId),
    enabled: !!doctorId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useAvailableSlots = (
  doctorId: string,
  date: string,
  clinicId?: string | null,
): UseQueryResult<AvailableSlotsResponse, AxiosError<ApiError>> => {
  return useQuery({
    queryKey: ["available-slots", doctorId, date, clinicId],
    queryFn: () => getAvailableSlots(doctorId, date, clinicId),
    enabled: !!doctorId && !!date,
    staleTime: 1 * 60 * 1000,
  });
};

export const useBookAppointment = (): UseMutationResult<
  BookAppointmentResponse,
  AxiosError<ApiError>,
  BookAppointmentRequest
> => {
  const { locale } = useLanguage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookAppointment,
    onSuccess: (data) => {
      const successMessage =
        locale === "ar"
          ? data.messageAr || "تم حجز الموعد بنجاح"
          : data.messageEn || data.message || "Appointment booked successfully";

      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description: successMessage,
      });

      queryClient.invalidateQueries({ queryKey: ["available-slots"] });
      queryClient.invalidateQueries({ queryKey: ["available-days"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error) => {
      const errorMessage =
        locale === "ar"
          ? error.response?.data?.messageAr || "فشل حجز الموعد"
          : error.response?.data?.messageEn ||
            error.message ||
            "Failed to book appointment";

      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
