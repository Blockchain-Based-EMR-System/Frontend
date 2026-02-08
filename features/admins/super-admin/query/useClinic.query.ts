import { useQuery } from "@tanstack/react-query";
import { getClinics, getClinicById } from "../api/clinic.api";

export const useClinics = () => {
  return useQuery({
    queryKey: ["clinics"],
    queryFn: getClinics,
  });
};

export const useClinicById = (id: string) => {
  return useQuery({
    queryKey: ["clinic", id],
    queryFn: () => getClinicById(id),
    enabled: !!id,
  });
};
