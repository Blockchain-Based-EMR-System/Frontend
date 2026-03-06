import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageProvider";
import { toast } from "@/hooks/useToast";
import {
  approveApplicant,
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementApplicants,
  getDoctorAnnouncements,
  rejectApplicant,
} from "../api/announcements.api";
import { CreateAnnouncementRequest } from "../types/announcement.types";

export const DOCTOR_ANNOUNCEMENTS_KEY = "doctor-announcements";
export const ANNOUNCEMENT_APPLICANTS_KEY = "announcement-applicants";

export function useDoctorAnnouncements() {
  return useQuery({
    queryKey: [DOCTOR_ANNOUNCEMENTS_KEY],
    queryFn: getDoctorAnnouncements,
  });
}

export function useAnnouncementApplicants(announcementId: string | null) {
  return useQuery({
    queryKey: [ANNOUNCEMENT_APPLICANTS_KEY, announcementId],
    queryFn: () => getAnnouncementApplicants(announcementId!),
    enabled: !!announcementId,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  const { locale } = useLanguage();

  return useMutation({
    mutationFn: (data: CreateAnnouncementRequest) => createAnnouncement(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [DOCTOR_ANNOUNCEMENTS_KEY] });
      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description: locale === "ar" ? data.messageAr : data.messageEn,
      });
    },
    onError: () => {
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description:
          locale === "ar"
            ? "فشل نشر الإعلان. حاول مرة أخرى."
            : "Failed to post announcement. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useApproveApplicant() {
  const queryClient = useQueryClient();
  const { locale } = useLanguage();

  return useMutation({
    mutationFn: ({
      applicantId,
      announcementId,
    }: {
      applicantId: string;
      announcementId: string;
    }) => approveApplicant(applicantId, announcementId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ANNOUNCEMENT_APPLICANTS_KEY, variables.announcementId],
      });
      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description: locale === "ar" ? data.messageAr : data.messageEn,
      });
    },
    onError: () => {
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description:
          locale === "ar"
            ? "فشل قبول المتقدم."
            : "Failed to approve applicant.",
        variant: "destructive",
      });
    },
  });
}

export function useRejectApplicant() {
  const queryClient = useQueryClient();
  const { locale } = useLanguage();

  return useMutation({
    mutationFn: ({
      applicantId,
      announcementId,
    }: {
      applicantId: string;
      announcementId: string;
    }) => rejectApplicant(applicantId, announcementId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ANNOUNCEMENT_APPLICANTS_KEY, variables.announcementId],
      });
      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description: locale === "ar" ? data.messageAr : data.messageEn,
      });
    },
    onError: () => {
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description:
          locale === "ar" ? "فشل رفض المتقدم." : "Failed to reject applicant.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  const { locale } = useLanguage();

  return useMutation({
    mutationFn: (announcementId: string) => deleteAnnouncement(announcementId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [DOCTOR_ANNOUNCEMENTS_KEY] });
      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description: locale === "ar" ? data.messageAr : data.messageEn,
      });
    },
    onError: () => {
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description:
          locale === "ar"
            ? "فشل حذف الإعلان."
            : "Failed to delete announcement.",
        variant: "destructive",
      });
    },
  });
}
