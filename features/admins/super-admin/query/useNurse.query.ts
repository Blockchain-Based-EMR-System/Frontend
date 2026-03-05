import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { getNurses, getNurseById } from "../api/nurse.api";
import { NurseListResponse, NurseDetailResponse } from "../types/nurseTypes";

export const useNurses = () => {
  const locale = useLocale();
  return useQuery<NurseListResponse>({
    queryKey: ["super-admin-nurses", locale],
    queryFn: () => getNurses(locale),
  });
};

export const useNurseById = (id: string | null) => {
  const locale = useLocale();
  return useQuery<NurseDetailResponse>({
    queryKey: ["super-admin-nurse", id, locale],
    queryFn: () => getNurseById(id!, locale),
    enabled: !!id,
  });
};
