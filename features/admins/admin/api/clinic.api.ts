import { api } from "@/lib/apiClient";
import {
  GetClinicsResponse,
  GetClinicDetailResponse,
  SetActiveStatusResponse,
} from "../types/clinic.types";

export const getClinics = async (
  locale: string,
): Promise<GetClinicsResponse> => {
  const response = await api.get<GetClinicsResponse>("/admin/clinics", {
    headers: {
      "Accept-Language": locale,
    },
  });
  return response;
};

export const getClinicById = async (
  id: string,
  locale: string,
): Promise<GetClinicDetailResponse> => {
  const response = await api.get<GetClinicDetailResponse>(
    `/admin/clinics/${id}`,
    {
      headers: {
        "Accept-Language": locale,
      },
    },
  );
  return response;
};

export const setClinicActiveStatus = async (
  id: string,
  isActive: boolean,
): Promise<SetActiveStatusResponse> => {
  const response = await api.patch<SetActiveStatusResponse>(
    `/admin/clinics/${id}/set-active-status`,
    { is_active: isActive },
  );
  return response;
};
