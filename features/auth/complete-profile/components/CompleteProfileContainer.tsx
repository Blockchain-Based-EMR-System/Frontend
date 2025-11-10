"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { CompleteProfileFormData } from "./completeProfileForm/CompleteProfileForm";
import {
  useCompleteProfile,
  useUpdateGoogleUserPhone,
} from "../query/useCompleteProfile.query";
import { useAuthFlowStore } from "@/stores/useAuthFlowStore";

export interface CompleteProfileContainerProps {
  children: (props: CompleteProfilePresentationalProps) => React.ReactNode;
  userPhone?: string | null;
  requirePhone?: boolean;
}

export interface CompleteProfilePresentationalProps {
  isLoading: boolean;
  handleCompleteProfile: (data: CompleteProfileFormData) => Promise<void>;
  requirePhone: boolean;
  initialPhone: string;
  t: (key: string) => string;
}

export function CompleteProfileContainer({
  children,
  userPhone,
  requirePhone = false,
}: CompleteProfileContainerProps) {
  const t = useTranslations("");
  const completeProfileMutation = useCompleteProfile();
  const updatePhoneMutation = useUpdateGoogleUserPhone();
  const clearSignupMethod = useAuthFlowStore(
    (state) => state.clearSignupMethod
  );
  const [phoneUpdated, setPhoneUpdated] = useState(false);

  const handleCompleteProfile = async (data: CompleteProfileFormData) => {
    try {
      // First, update phone if required (for Google users)
      if (requirePhone && data.phone) {
        console.log("🔵 STEP 1: Updating phone for Google user");
        console.log("📱 Phone value from form:", data.phone);
        console.log("📱 Phone type:", typeof data.phone);
        console.log("📱 Phone length:", data.phone.length);

        const phonePayload = { phone: data.phone };
        console.log("📤 Sending payload:", phonePayload);

        const phoneResult = await updatePhoneMutation.mutateAsync(phonePayload);
        console.log("✅ Phone updated successfully, result:", phoneResult);
        setPhoneUpdated(true);
      } else {
        console.log("⏭️ Skipping phone update:", {
          requirePhone,
          hasPhone: !!data.phone,
        });
      }

      // Then complete the profile with gender and date of birth
      console.log("🔵 STEP 2: Completing profile");
      console.log("👤 Profile data:", {
        gender: data.gender,
        date_of_birth: data.date_of_birth,
      });

      await completeProfileMutation.mutateAsync({
        gender: data.gender,
        date_of_birth: data.date_of_birth,
      });

      console.log("🎉 All steps completed successfully!");
      clearSignupMethod();
    } catch (error) {
      console.error("❌ Error during profile completion:", error);
      // Error handling is done in the mutation hooks
    }
  };

  return (
    <>
      {children({
        isLoading:
          completeProfileMutation.isPending || updatePhoneMutation.isPending,
        handleCompleteProfile,
        requirePhone,
        initialPhone: userPhone || "",
        t,
      })}
    </>
  );
}
