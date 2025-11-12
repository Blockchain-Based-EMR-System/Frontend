import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { forgetPassword, resetPassword } from "../api/password.api";
import {
  ForgetPasswordRequest,
  ForgetPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/passwordTypes";
import { ApiError } from "@/types/common";
import { toast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useRouter } from "next/navigation";

export const useForgetPassword = (): UseMutationResult<
  ForgetPasswordResponse,
  AxiosError<ApiError>,
  ForgetPasswordRequest
> => {
  const { locale } = useLanguage();

  return useMutation({
    mutationFn: forgetPassword,
    onSuccess: (data) => {
      const successMessage =
        locale === "ar"
          ? data.messageAr ||
            "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
          : data.messageEn || "Password reset link has been sent to your email";

      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description: successMessage,
      });
    },
    onError: (error) => {
      const errorData = error.response?.data;
      const errorMessage =
        locale === "ar"
          ? errorData?.messageAr ||
            "حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور"
          : errorData?.messageEn ||
            "An error occurred while sending password reset link";

      toast({
        variant: "destructive",
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
      });

      if (process.env.NODE_ENV === "development") {
        console.error("Forget Password Error:", error);
      }
    },
  });
};

export const useResetPassword = (): UseMutationResult<
  ResetPasswordResponse,
  AxiosError<ApiError>,
  ResetPasswordRequest
> => {
  const { locale } = useLanguage();
  const router = useRouter();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      const successMessage =
        locale === "ar"
          ? data.messageAr || "تم إعادة تعيين كلمة المرور بنجاح"
          : data.messageEn || "Password reset successfully";

      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description: successMessage,
      });

      router.push("/login");
    },
    onError: (error) => {
      const errorData = error.response?.data;
      const errorMessage =
        locale === "ar"
          ? errorData?.messageAr || "حدث خطأ أثناء إعادة تعيين كلمة المرور"
          : errorData?.messageEn ||
            "An error occurred while resetting password";

      toast({
        variant: "destructive",
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
      });

      if (process.env.NODE_ENV === "development") {
        console.error("Reset Password Error:", error);
      }
    },
  });
};
