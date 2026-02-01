import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { getDoctors, verifyDoctor } from "../api/doctor.api";
import { GetDoctorsResponse } from "../types/doctor.types";

export const useDoctors = () => {
  const locale = useLocale();
  return useQuery<GetDoctorsResponse>({
    queryKey: ["admin-doctors", locale],
    queryFn: () => getDoctors(locale),
  });
};

export const useVerifyDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isVerified }: { id: string; isVerified: boolean }) =>
      verifyDoctor(id, isVerified),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
    },
  });
};
