"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageProvider";
import { ApiError } from "@/types";
import { getLocalizedMessage } from "@/lib/helpers";
import {
  createMedicalHistoryRecord,
  deleteMedicalHistoryRecord,
  getPatientMedicalHistory,
  updateMedicalHistoryRecord,
} from "../api/medicalHistory.api";
import {
  CreateMedicalHistoryResponse,
  DeleteMedicalHistoryResponse,
  mapMedicalHistoryRecord,
  MedicalHistoryRecord,
  UpdateMedicalHistoryResponse,
  UpsertMedicalHistoryRequest,
} from "../types/medicalHistory.types";

export const MEDICAL_HISTORY_QUERY_KEY = ["medical-history", "patient"];

function logMedicalHistoryQueryError(context: string, error: unknown) {
  const axiosError = error as AxiosError;

  console.error(`[MedicalHistory Query] ${context} failed`, {
    status: axiosError.response?.status,
    statusText: axiosError.response?.statusText,
    responseData: axiosError.response?.data,
    message: axiosError.message,
  });
}

export const usePatientMedicalHistory = (): UseQueryResult<
  MedicalHistoryRecord[],
  Error
> => {
  return useQuery({
    queryKey: MEDICAL_HISTORY_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await getPatientMedicalHistory();
        const rawRecords = response.data || [];

        return rawRecords
          .map(mapMedicalHistoryRecord)
          .filter((record): record is MedicalHistoryRecord => record !== null)
          .sort((firstRecord, secondRecord) => {
            const firstDate = new Date(firstRecord.content.date).getTime();
            const secondDate = new Date(secondRecord.content.date).getTime();
            return secondDate - firstDate;
          });
      } catch (error) {
        logMedicalHistoryQueryError("Fetch patient medical history", error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
};

export const useCreateMedicalHistory = (): UseMutationResult<
  CreateMedicalHistoryResponse,
  AxiosError<ApiError>,
  UpsertMedicalHistoryRequest
> => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { locale } = useLanguage();
  const tMedicalHistory = useTranslations("userDashboard.medicalHistory");

  return useMutation({
    mutationFn: createMedicalHistoryRecord,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: MEDICAL_HISTORY_QUERY_KEY });
      toast({
        title: tMedicalHistory("createdSuccess"),
        description: getLocalizedMessage(response, locale),
      });
    },
    onError: (error) => {
      logMedicalHistoryQueryError("Create medical history", error);

      toast({
        title: tMedicalHistory("createFailed"),
        description:
          locale === "ar"
            ? error.response?.data?.messageAr ||
              tMedicalHistory("createFailedDesc")
            : error.response?.data?.messageEn ||
              tMedicalHistory("createFailedDesc"),
        variant: "destructive",
      });
    },
  });
};

export const useUpdateMedicalHistory = (): UseMutationResult<
  UpdateMedicalHistoryResponse,
  AxiosError<ApiError>,
  { recordId: string; payload: UpsertMedicalHistoryRequest }
> => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { locale } = useLanguage();
  const tMedicalHistory = useTranslations("userDashboard.medicalHistory");

  return useMutation({
    mutationFn: ({ recordId, payload }) =>
      updateMedicalHistoryRecord(recordId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: MEDICAL_HISTORY_QUERY_KEY });
      toast({
        title: tMedicalHistory("updatedSuccess"),
        description: getLocalizedMessage(response, locale),
      });
    },
    onError: (error) => {
      logMedicalHistoryQueryError("Update medical history", error);

      toast({
        title: tMedicalHistory("updateFailed"),
        description:
          locale === "ar"
            ? error.response?.data?.messageAr ||
              tMedicalHistory("updateFailedDesc")
            : error.response?.data?.messageEn ||
              tMedicalHistory("updateFailedDesc"),
        variant: "destructive",
      });
    },
  });
};

export const useDeleteMedicalHistory = (): UseMutationResult<
  DeleteMedicalHistoryResponse,
  AxiosError<ApiError>,
  string
> => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { locale } = useLanguage();
  const tMedicalHistory = useTranslations("userDashboard.medicalHistory");

  return useMutation({
    mutationFn: deleteMedicalHistoryRecord,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: MEDICAL_HISTORY_QUERY_KEY });
      toast({
        title: tMedicalHistory("deletedSuccess"),
        description: getLocalizedMessage(response, locale),
      });
    },
    onError: (error) => {
      logMedicalHistoryQueryError("Delete medical history", error);

      toast({
        title: tMedicalHistory("deleteFailed"),
        description:
          locale === "ar"
            ? error.response?.data?.messageAr ||
              tMedicalHistory("deleteFailedDesc")
            : error.response?.data?.messageEn ||
              tMedicalHistory("deleteFailedDesc"),
        variant: "destructive",
      });
    },
  });
};
