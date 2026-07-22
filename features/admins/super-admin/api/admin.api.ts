import { api } from "@/lib/apiClient";
import {
  CreateAdminRequest,
  AdminListResponse,
  AdminDetailResponse,
} from "../types/adminTypes";

export const createAdmin = async (
  data: CreateAdminRequest
): Promise<AdminDetailResponse> => {
  const response = await api.post<AdminDetailResponse>(
    "/super-admin/admins",
    data
  );
  return response;
};

export const getAdmins = async (): Promise<AdminListResponse> => {
  const response = await api.get<AdminListResponse>("/super-admin/admins");
  return response;
};

export const getAdminById = async (
  id: string
): Promise<AdminDetailResponse> => {
  const response = await api.get<AdminDetailResponse>(
    `/super-admin/admins/${id}`
  );
  return response;
};
