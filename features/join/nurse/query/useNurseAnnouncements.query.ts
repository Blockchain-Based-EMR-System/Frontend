import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  getNurseAnnouncements,
  getNurseApplications,
  applyToAnnouncement,
} from "../api/nurseAnnouncements.api";
import { ApplyResponse } from "../types/nurseAnnouncementTypes";
import { ApiError } from "@/types";
import { toast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageProvider";

export const NURSE_ANNOUNCEMENTS_QUERY_KEY = "nurse-announcements";
export const NURSE_APPLICATIONS_QUERY_KEY = "nurse-applications";

export const useNurseAnnouncements = () => {
  return useQuery({
    queryKey: [NURSE_ANNOUNCEMENTS_QUERY_KEY],
    queryFn: getNurseAnnouncements,
  });
};

export const useNurseApplications = () => {
  return useQuery({
    queryKey: [NURSE_APPLICATIONS_QUERY_KEY],
    queryFn: getNurseApplications,
  });
};

export const useApplyToAnnouncement = () => {
  const queryClient = useQueryClient();
  const { locale } = useLanguage();

  return useMutation<ApplyResponse, AxiosError<ApiError>, string>({
    mutationFn: applyToAnnouncement,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [NURSE_APPLICATIONS_QUERY_KEY],
      });
      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description:
          locale === "ar"
            ? data.messageAr || "تم التقديم على الإعلان بنجاح"
            : data.messageEn || "Applied to announcement successfully",
      });
    },
    onError: (error) => {
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description:
          locale === "ar"
            ? error.response?.data?.messageAr || "فشل التقديم على الإعلان"
            : error.response?.data?.messageEn ||
              "Failed to apply to this announcement",
        variant: "destructive",
      });
    },
  });
};
