import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import {
  getAllNurses,
  getUnverifiedNurses,
  verifyNurse,
} from "../api/nurse.api";
import {
  GetAllNursesResponse,
  GetUnverifiedNursesResponse,
} from "../types/nurse.types";

export const useAllNurses = () => {
  const locale = useLocale();
  return useQuery<GetAllNursesResponse>({
    queryKey: ["admin-nurses-all", locale],
    queryFn: () => getAllNurses(locale),
  });
};

export const useUnverifiedNurses = () => {
  const locale = useLocale();
  return useQuery<GetUnverifiedNursesResponse>({
    queryKey: ["admin-nurses", locale],
    queryFn: () => getUnverifiedNurses(locale),
  });
};

export const useVerifyNurse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isVerified }: { id: string; isVerified: boolean }) =>
      verifyNurse(id, isVerified),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-nurses"] });
      queryClient.invalidateQueries({ queryKey: ["admin-nurses-all"] });
    },
  });
};
