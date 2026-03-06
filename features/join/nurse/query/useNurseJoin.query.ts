import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { submitNurseJoin } from "../api/nurseJoin.api";
import { NurseJoinFormData, NurseJoinResponse } from "../types/nurseJoinTypes";
import { ApiError } from "@/types";
import { toast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useRouter } from "next/navigation";

export const useNurseJoin = (): UseMutationResult<
  NurseJoinResponse,
  AxiosError<ApiError>,
  NurseJoinFormData
> => {
  const { locale } = useLanguage();
  const router = useRouter();

  return useMutation({
    mutationFn: submitNurseJoin,
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
        router.push("/");
      }, 2000);
    },
    onError: (error) => {
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
