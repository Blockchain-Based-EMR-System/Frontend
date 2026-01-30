import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { submitDoctorJoin } from "../api/doctorJoin.api";
import {
  DoctorJoinFormData,
  DoctorJoinResponse,
} from "../types/doctorJoinTypes";
import { ApiError } from "@/types";
import { toast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useRouter } from "next/navigation";

export const useDoctorJoin = (): UseMutationResult<
  DoctorJoinResponse,
  AxiosError<ApiError>,
  DoctorJoinFormData
> => {
  const { locale } = useLanguage();
  const router = useRouter();

  return useMutation({
    mutationFn: submitDoctorJoin,
    onSuccess: (data) => {
      const successMessage =
        data.message ||
        (locale === "ar"
          ? data.messageAr || "تم إرسال طلبك بنجاح"
          : data.messageEn ||
            "Your application has been submitted successfully");

      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description: successMessage,
      });

      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 2000);
    },
    onError: (error) => {
      console.error("Backend error:", error.response?.data);
      console.error("Status code:", error.response?.status);

      const errorMessage =
        locale === "ar"
          ? error.response?.data?.messageAr || "فشل إرسال طلبك"
          : error.response?.data?.messageEn ||
            "Failed to submit your application";

      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
