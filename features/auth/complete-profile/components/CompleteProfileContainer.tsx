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
      if (requirePhone && data.phone) {
        await updatePhoneMutation.mutateAsync({ phone: data.phone });
        setPhoneUpdated(true);
      }

      await completeProfileMutation.mutateAsync({
        gender: data.gender,
        date_of_birth: data.date_of_birth,
      });

      clearSignupMethod();
    } catch (error) {
      console.error("Error completing profile:", error);
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
