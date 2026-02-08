import { api } from "@/lib/apiClient";
import { ClinicListResponse, ClinicDetailResponse } from "../types/clinicTypes";

export const getClinics = async (): Promise<ClinicListResponse> => {
  const response = await api.get<ClinicListResponse>("/super-admin/clinics");
  return response;
};

export const getClinicById = async (
  id: string,
): Promise<ClinicDetailResponse> => {
  const response = await api.get<ClinicDetailResponse>(
    `/super-admin/clinics/${id}`,
  );
  return response;
};
