import { GetDoctorsResponse } from "./../types/doctor.types";
import { api } from "@/lib/apiClient";

export const getDoctors = async (
  locale: string,
): Promise<GetDoctorsResponse> => {
  const response = await api.get<GetDoctorsResponse>("/admin/doctors", {
    headers: {
      "Accept-Language": locale,
    },
  });
  return response;
};

export const verifyDoctor = async (id: string, isVerified: boolean) => {
  const res = await api.patch(`/admin/doctors/verify/${id}`, { isVerified });
  return res;
};
