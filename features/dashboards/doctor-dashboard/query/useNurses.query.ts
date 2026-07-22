import { useQuery } from "@tanstack/react-query";
import { getDoctorNurses } from "../api/nurses.api";

export const DOCTOR_NURSES_QUERY_KEY = "doctor-nurses";

export const useDoctorNurses = () => {
  return useQuery({
    queryKey: [DOCTOR_NURSES_QUERY_KEY],
    queryFn: getDoctorNurses,
  });
};
