import { api } from "@/lib/apiClient";
import { NurseListResponse, NurseDetailResponse } from "../types/nurseTypes";

export const getNurses = async (locale: string): Promise<NurseListResponse> => {
  const response = await api.get<NurseListResponse>("/super-admin/nurses", {
    headers: {
      "Accept-Language": locale,
    },
  });
  return response;
};

export const getNurseById = async (
  id: string,
  locale: string,
): Promise<NurseDetailResponse> => {
  const response = await api.get<NurseDetailResponse>(
    `/super-admin/nurses/${id}`,
    {
      headers: {
        "Accept-Language": locale,
      },
    },
  );
  return response;
};
