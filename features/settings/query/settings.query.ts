"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProfile,
  checkPassword,
  changePassword,
} from "../api/settings.api";
import { useToast } from "@/hooks/useToast";
import { useUserStore } from "@/stores/useUserStore";
import { useLanguage } from "@/contexts/LanguageProvider";
import { getLocalizedMessage } from "@/lib/helpers";
import {
  UpdateProfileRequest,
  UpdateProfileResponse,
  CheckPasswordRequest,
  CheckPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "../types/settings.types";
import { useRouter } from "next/navigation";

export const useUpdateProfile = () => {
  const { toast } = useToast();
  const { locale } = useLanguage();
  const queryClient = useQueryClient();
  const { updateUser } = useUserStore();

  return useMutation<UpdateProfileResponse, Error, UpdateProfileRequest>({
    mutationFn: updateProfile,
    onSuccess: (data, variables) => {
      toast({
        title: locale === "en" ? "Success" : "نجاح",
        description: getLocalizedMessage(data, locale),
      });

      // Update user store with new data
      updateUser({
        name: variables.name,
        phone: variables.phone,
        gender: variables.gender,
        date_of_birth: variables.date_of_birth,
      });

      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      console.error("Error updating profile:", error);
      const errorMessage = error?.response?.data
        ? getLocalizedMessage(error.response.data, locale)
        : error?.message ||
          (locale === "en"
            ? "Failed to update profile"
            : "فشل تحديث الملف الشخصي");
      toast({
        title: locale === "en" ? "Update failed" : "فشل التحديث",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useCheckPassword = () => {
  const { toast } = useToast();
  const { locale } = useLanguage();

  return useMutation<CheckPasswordResponse, Error, CheckPasswordRequest>({
    mutationFn: checkPassword,
    onError: (error: any) => {
      console.error("Error checking password:", error);
      const errorMessage = error?.response?.data
        ? getLocalizedMessage(error.response.data, locale)
        : error?.message ||
          (locale === "en"
            ? "Failed to check password"
            : "فشل التحقق من كلمة المرور");
      toast({
        title: locale === "en" ? "Verification failed" : "فشل التحقق",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useChangePassword = () => {
  const { toast } = useToast();
  const { locale } = useLanguage();
  const router = useRouter();


  return useMutation<ChangePasswordResponse, Error, ChangePasswordRequest>({
    mutationFn: changePassword,
    onSuccess: (data) => {
      toast({
        title: locale === "en" ? "Success" : "نجاح",
        description: getLocalizedMessage(data, locale),
      });
      router.push("/settings/profile");
    },
    onError: (error: any) => {
      console.error("Error changing password:", error);
      const errorMessage = error?.response?.data
        ? getLocalizedMessage(error.response.data, locale)
        : error?.message ||
          (locale === "en"
            ? "Failed to change password"
            : "فشل تغيير كلمة المرور");
      toast({
        title: locale === "en" ? "Change failed" : "فشل التغيير",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
