import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { signupUser, verifyOTP, completeProfile } from "../api/register.api";
import {
  SignupRequest,
  SignupResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  CompleteProfileRequest,
  CompleteProfileResponse,
} from "../types/authTypes";
import { ApiError } from "@/types/common";
import { toast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import { useAuthFlowStore } from "@/stores/useAuthFlowStore";

export const useSignup = (): UseMutationResult<
  SignupResponse,
  AxiosError<ApiError>,
  SignupRequest
> => {
  const { locale } = useLanguage();
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const setSignupMethod = useAuthFlowStore((state) => state.setSignupMethod);

  return useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      setSignupMethod("email");

      if (data.data) {
        setUser(data.data);
      }

      const successMessage =
        data.message ||
        (locale === "ar"
          ? data.messageAr ||
            "تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني"
          : data.messageEn ||
            "Account created successfully. Please check your email for verification code");

      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description: successMessage,
      });

      router.push("/verify-email");
    },
    onError: (error) => {
      const errorData = error.response?.data;
      const errorMessage =
        locale === "ar"
          ? errorData?.messageAr || "حدث خطأ أثناء إنشاء الحساب"
          : errorData?.messageEn || "An error occurred during registration";

      toast({
        variant: "destructive",
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
      });

      if (process.env.NODE_ENV === "development") {
        console.error("Signup Error:", error);
      }
    },
  });
};

export const useVerifyOTP = (): UseMutationResult<
  VerifyOTPResponse,
  AxiosError<ApiError>,
  VerifyOTPRequest
> => {
  const { locale } = useLanguage();
  const router = useRouter();

  return useMutation({
    mutationFn: verifyOTP,
    onSuccess: (data) => {
      const successMessage =
        data.message ||
        (locale === "ar"
          ? data.messageAr || "تم التحقق من البريد الإلكتروني بنجاح"
          : data.messageEn || "Email verified successfully");

      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description: successMessage,
      });

      router.push("/complete-profile");
    },
    onError: (error) => {
      const errorData = error.response?.data;
      const errorMessage =
        locale === "ar"
          ? errorData?.messageAr || "رمز التحقق غير صحيح"
          : errorData?.messageEn || "Invalid verification code";

      toast({
        variant: "destructive",
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
      });

      if (process.env.NODE_ENV === "development") {
        console.error("OTP Verification Error:", error);
      }
    },
  });
};

export const useCompleteProfile = (): UseMutationResult<
  CompleteProfileResponse,
  AxiosError<ApiError>,
  CompleteProfileRequest
> => {
  const { locale } = useLanguage();
  const router = useRouter();
  const updateUser = useUserStore((state) => state.updateUser);
  const clearSignupMethod = useAuthFlowStore(
    (state) => state.clearSignupMethod
  );

  return useMutation({
    mutationFn: completeProfile,
    onSuccess: (data) => {
      if (data.data) {
        updateUser({
          gender: data.data.gender,
          date_of_birth: data.data.date_of_birth,
        });
      }

      clearSignupMethod();

      const successMessage =
        data.message ||
        (locale === "ar"
          ? data.messageAr || "تم تحديث الملف الشخصي بنجاح"
          : data.messageEn || "Profile completed successfully");

      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description: successMessage,
      });

      router.push("/dashboard");
    },
    onError: (error) => {
      const errorData = error.response?.data;
      const errorMessage =
        locale === "ar"
          ? errorData?.messageAr || "حدث خطأ أثناء تحديث الملف الشخصي"
          : errorData?.messageEn || "An error occurred while updating profile";

      toast({
        variant: "destructive",
        title: locale === "ar" ? "خطأ" : "Error",
        description: errorMessage,
      });

      if (process.env.NODE_ENV === "development") {
        console.error("Complete Profile Error:", error);
      }
    },
  });
};
