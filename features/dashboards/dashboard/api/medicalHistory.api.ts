import { api } from "@/lib/apiClient";
import { AxiosError } from "axios";
import {
  PatientMedicalHistoryListResponse,
  CreateMedicalHistoryResponse,
  DeleteMedicalHistoryResponse,
  UpdateMedicalHistoryResponse,
  UpsertMedicalHistoryRequest,
} from "../types/medicalHistory.types";

function logMedicalHistoryApiError(
  operation: string,
  endpoint: string,
  error: unknown,
) {
  const axiosError = error as AxiosError;

  console.error(`[MedicalHistory API] ${operation} failed`, {
    endpoint,
    status: axiosError.response?.status,
    statusText: axiosError.response?.statusText,
    responseData: axiosError.response?.data,
    message: axiosError.message,
  });
}

export const getPatientMedicalHistory =
  async (): Promise<PatientMedicalHistoryListResponse> => {
    const endpoint = "/medical-records/patient/medical-history";

    try {
      return await api.get<PatientMedicalHistoryListResponse>(endpoint);
    } catch (error) {
      logMedicalHistoryApiError("GET", endpoint, error);
      throw error;
    }
  };

export const createMedicalHistoryRecord = async (
  payload: UpsertMedicalHistoryRequest,
): Promise<CreateMedicalHistoryResponse> => {
  const endpoint = "/medical-records/patient/medical-history";

  try {
    console.log("Creating medical history record with payload:", payload);
    return await api.post<CreateMedicalHistoryResponse>(endpoint, payload);
  } catch (error) {
    logMedicalHistoryApiError("POST", endpoint, error);
    throw error;
  }
};

export const updateMedicalHistoryRecord = async (
  recordId: string,
  payload: UpsertMedicalHistoryRequest,
): Promise<UpdateMedicalHistoryResponse> => {
  const endpoint = `/medical-records/patient/medical-history/${recordId}`;

  try {
    return await api.patch<UpdateMedicalHistoryResponse>(endpoint, payload);
  } catch (error) {
    logMedicalHistoryApiError("PATCH", endpoint, error);
    throw error;
  }
};

export const deleteMedicalHistoryRecord = async (
  recordId: string,
): Promise<DeleteMedicalHistoryResponse> => {
  const endpoint = `/medical-records/patient/medical-history/${recordId}`;

  try {
    return await api.delete<DeleteMedicalHistoryResponse>(endpoint);
  } catch (error) {
    logMedicalHistoryApiError("DELETE", endpoint, error);
    throw error;
  }
};
