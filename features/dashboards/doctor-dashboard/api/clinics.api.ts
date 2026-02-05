import { api } from "@/lib/apiClient";
import {
  GetClinicsResponse,
  GetClinicResponse,
  CreateClinicRequest,
  CreateClinicResponse,
  UpdateClinicRequest,
  UpdateClinicResponse,
  DeleteClinicResponse,
  UpdateClinicFeesRequest,
  UpdateClinicFeesResponse,
} from "../types/clinic.types";

export const getClinics = async (): Promise<GetClinicsResponse> => {
  return api.get<GetClinicsResponse>("/clinics");
};

export const getClinic = async (id: string): Promise<GetClinicResponse> => {
  return api.get<GetClinicResponse>(`/clinics/${id}`);
};

export const createClinic = async (
  data: CreateClinicRequest,
): Promise<CreateClinicResponse> => {
  return api.post<CreateClinicResponse>("/clinics", data);
};

export const updateClinic = async (
  id: string,
  data: UpdateClinicRequest,
): Promise<UpdateClinicResponse> => {
  return api.patch<UpdateClinicResponse>(`/clinics/${id}`, data);
};

export const updateClinicFees = async (
  id: string,
  data: UpdateClinicFeesRequest,
): Promise<UpdateClinicFeesResponse> => {
  return api.patch<UpdateClinicFeesResponse>(`/clinics/${id}/fees`, data);
};

export const deleteClinic = async (
  id: string,
): Promise<DeleteClinicResponse> => {
  return api.delete<DeleteClinicResponse>(`/clinics/${id}`);
};
