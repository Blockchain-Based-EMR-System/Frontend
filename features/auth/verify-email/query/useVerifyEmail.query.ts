import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { verifyEmail, resendOtp } from "../api/verifyEmail.api";
import {
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResendOtpResponse,
} from "../types/verifyEmailTypes";
import { ApiError } from "@/types/common";
import { toast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useAuthSync } from "@/hooks/useAuthSync";

export const useVerifyEmail = (): UseMutationResult<
  VerifyEmailResponse,
  AxiosError<ApiError>,
  VerifyEmailRequest
> => {
  const { locale } = useLanguage();
  const { user, updateAuthState } = useAuthSync();

  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      const successMessage =
        locale === "ar"
          ? data.messageAr || "تم التحقق من البريد الإلكتروني بنجاح"
          : data.messageEn || "Email verified successfully";

      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description: successMessage,
      });

      if (user) {
        const updatedUser = { ...user, isVerified: true };
        updateAuthState(updatedUser);

      } else {
        console.error("User is null");
      }

      setTimeout(() => {
        window.location.href = "/complete-profile";
      }, 100);
    },
    onError: (error) => {
      const errorData = error.response?.data;
      const errorMessage =
        locale === "ar"
          ? errorData?.messageAr || "رمز التحقق غير صالح"
          : errorData?.messageEn || "Invalid OTP code";

      toast({
        variant: "destructive",
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
      });

      if (process.env.NODE_ENV === "development") {
        console.error("Verify Email Error:", error);
      }
    },
  });
};

export const useResendOtp = (): UseMutationResult<
  ResendOtpResponse,
  AxiosError<ApiError>,
  void
> => {
  const { locale } = useLanguage();

  return useMutation({
    mutationFn: resendOtp,
    onSuccess: (data) => {
      const successMessage =
        locale === "ar"
          ? data.messageAr || "تم إرسال رمز التحقق مرة أخرى"
          : data.messageEn || "OTP resent successfully";

      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description: successMessage,
      });
    },
    onError: (error) => {
      const errorData = error.response?.data;
      const errorMessage =
        locale === "ar"
          ? errorData?.messageAr || "فشل إرسال رمز التحقق"
          : errorData?.messageEn || "Failed to resend OTP";

      toast({
        variant: "destructive",
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
      });

      if (process.env.NODE_ENV === "development") {
        console.error("Resend OTP Error:", error);
      }
    },
  });
};
