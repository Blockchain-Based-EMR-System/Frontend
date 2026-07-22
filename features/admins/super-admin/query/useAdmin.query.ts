import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAdmin, getAdmins, getAdminById } from "../api/admin.api";
import { CreateAdminRequest } from "../types/adminTypes";

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdminRequest) => createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};

export const useAdmins = () => {
  return useQuery({
    queryKey: ["admins"],
    queryFn: getAdmins,
  });
};

export const useAdminById = (id: string) => {
  return useQuery({
    queryKey: ["admin", id],
    queryFn: () => getAdminById(id),
    enabled: !!id,
  });
};
