import { api } from "@/lib/apiClient";
import {
  GetAllNursesResponse,
  GetUnverifiedNursesResponse,
} from "../types/nurse.types";

export const getAllNurses = async (
  locale: string,
): Promise<GetAllNursesResponse> => {
  const response = await api.get<GetAllNursesResponse>("/admin/nurses", {
    headers: { "Accept-Language": locale },
  });
  return response;
};

export const getUnverifiedNurses = async (
  locale: string,
): Promise<GetUnverifiedNursesResponse> => {
  const response = await api.get<GetUnverifiedNursesResponse>(
    "/admin/nurses/unverified",
    {
      headers: {
        "Accept-Language": locale,
      },
    },
  );
  return response;
};

export const verifyNurse = async (id: string, isVerified: boolean) => {
  const response = await api.patch(`/admin/nurses/verify/${id}`, {
    isVerified,
  });
  return response;
};
