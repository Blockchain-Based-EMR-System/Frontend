import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import {
  getClinics,
  getClinicById,
  setClinicActiveStatus,
} from "../api/clinic.api";
import {
  GetClinicsResponse,
  GetClinicDetailResponse,
} from "../types/clinic.types";

export const useClinics = () => {
  const locale = useLocale();
  return useQuery<GetClinicsResponse>({
    queryKey: ["admin-clinics", locale],
    queryFn: () => getClinics(locale),
  });
};

export const useClinicById = (id: string) => {
  const locale = useLocale();
  return useQuery<GetClinicDetailResponse>({
    queryKey: ["admin-clinic", id, locale],
    queryFn: () => getClinicById(id, locale),
    enabled: !!id,
  });
};

export const useSetClinicActiveStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      setClinicActiveStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clinics"] });
    },
  });
};
