import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDoctor, getDoctors, getDoctorById } from "../api/doctor.api";
import { CreateDoctorRequest } from "../types/doctorTypes";

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDoctorRequest) => createDoctor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

export const useDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
  });
};

export const useDoctorById = (id: string) => {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: () => getDoctorById(id),
    enabled: !!id,
  });
};
