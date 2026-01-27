import { api } from "@/lib/apiClient";
import {
  CreateDoctorRequest,
  DoctorListResponse,
  DoctorDetailResponse,
} from "../types/doctorTypes";

export const createDoctor = async (
  data: CreateDoctorRequest
): Promise<DoctorDetailResponse> => {
  const response = await api.post<DoctorDetailResponse>(
    "/super-admin/doctors",
    data
  );
  return response;
};

export const getDoctors = async (): Promise<DoctorListResponse> => {
  const response = await api.get<DoctorListResponse>("/super-admin/doctors");
  return response;
};

export const getDoctorById = async (
  id: string
): Promise<DoctorDetailResponse> => {
  const response = await api.get<DoctorDetailResponse>(
    `/super-admin/doctors/${id}`
  );
  return response;
};
