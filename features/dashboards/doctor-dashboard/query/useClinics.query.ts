import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  getClinics,
  getClinic,
  createClinic,
  updateClinic,
  deleteClinic,
} from "../api/clinics.api";
import {
  Clinic,
  CreateClinicRequest,
  CreateClinicResponse,
  UpdateClinicRequest,
  UpdateClinicResponse,
  DeleteClinicResponse,
  GetClinicsResponse,
  GetClinicResponse,
} from "../types/clinic.types";
import { ApiError } from "@/types";
import { toast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageProvider";

export const clinicsKeys = {
  all: ["clinics"] as const,
  detail: (id: string) => ["clinics", id] as const,
};

export const CLINICS_QUERY_KEY = "doctor-clinics";

export const useClinics = (): UseQueryResult<
  GetClinicsResponse,
  AxiosError<ApiError>
> => {
  return useQuery({
    queryKey: clinicsKeys.all,
    queryFn: getClinics,
  });
};

export const useClinic = (
  id: string,
): UseQueryResult<GetClinicResponse, AxiosError<ApiError>> => {
  return useQuery({
    queryKey: clinicsKeys.detail(id),
    queryFn: () => getClinic(id),
    enabled: !!id,
  });
};

export const useCreateClinic = (): UseMutationResult<
  CreateClinicResponse,
  AxiosError<ApiError>,
  CreateClinicRequest
> => {
  const { locale } = useLanguage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClinic,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: clinicsKeys.all });

      const successMessage =
        locale === "ar"
          ? data.messageAr || "تم إنشاء العيادة بنجاح"
          : data.messageEn || "Clinic created successfully";

      toast({
        title: locale === "ar" ? "نجاح" : "Success",
        description: successMessage,
      });
    },
    onError: (error) => {
      const errorMessage =
        locale === "ar"
          ? error.response?.data?.messageAr || "فشل إنشاء العيادة"
          : error.response?.data?.messageEn || "Failed to create clinic";

      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateClinic = (): UseMutationResult<
  UpdateClinicResponse,
  AxiosError<ApiError>,
  { id: string; data: UpdateClinicRequest }
> => {
  const { locale } = useLanguage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateClinic(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: clinicsKeys.all });
      queryClient.invalidateQueries({
        queryKey: clinicsKeys.detail(variables.id),
      });

      const successMessage =
        locale === "ar"
          ? data.messageAr || "تم تحديث العيادة بنجاح"
          : data.messageEn || "Clinic updated successfully";

      toast({
        title: locale === "ar" ? "نجاح" : "Success",
        description: successMessage,
      });
    },
    onError: (error) => {
      const errorMessage =
        locale === "ar"
          ? error.response?.data?.messageAr || "فشل تحديث العيادة"
          : error.response?.data?.messageEn || "Failed to update clinic";

      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteClinic = (): UseMutationResult<
  DeleteClinicResponse,
  AxiosError<ApiError>,
  string
> => {
  const { locale } = useLanguage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClinic,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: clinicsKeys.all });

      const successMessage =
        locale === "ar"
          ? data.messageAr || "تم حذف العيادة بنجاح"
          : data.messageEn || "Clinic deleted successfully";

      toast({
        title: locale === "ar" ? "نجاح" : "Success",
        description: successMessage,
      });
    },
    onError: (error) => {
      const errorMessage =
        locale === "ar"
          ? error.response?.data?.messageAr || "فشل حذف العيادة"
          : error.response?.data?.messageEn || "Failed to delete clinic";

      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
