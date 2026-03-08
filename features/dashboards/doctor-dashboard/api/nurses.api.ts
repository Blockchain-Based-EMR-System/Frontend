import { api } from "@/lib/apiClient";
import { GetDoctorNursesResponse } from "../types/nurse.types";

export const getDoctorNurses = async (): Promise<GetDoctorNursesResponse> => {
  return api.get<GetDoctorNursesResponse>("/doctors/nurses");
};
