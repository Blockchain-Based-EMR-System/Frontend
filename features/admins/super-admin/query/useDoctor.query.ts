import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { createDoctor, getDoctors, getDoctorById } from "../api/doctor.api";
import { CreateDoctorRequest } from "../types/doctorTypes";

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDoctorRequest) => createDoctor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-doctors"] });
    },
  });
};

export const useDoctors = () => {
  const locale = useLocale();
  return useQuery({
    queryKey: ["super-admin-doctors", locale],
    queryFn: () => getDoctors(locale),
  });
};

export const useDoctorById = (id: string) => {
  const locale = useLocale();
  return useQuery({
    queryKey: ["super-admin-doctor", id, locale],
    queryFn: () => getDoctorById(id, locale),
    enabled: !!id,
  });
};
