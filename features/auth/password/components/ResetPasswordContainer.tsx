"use client";

import { useTranslations } from "next-intl";
import { ResetPasswordFormData } from "./resetPasswordForm/ResetPasswordForm";
import { useResetPassword } from "../query/usePassword.query";

export interface ResetPasswordContainerProps {
  children: (props: ResetPasswordPresentationalProps) => React.ReactNode;
  token: string;
}

export interface ResetPasswordPresentationalProps {
  isLoading: boolean;
  handleResetPassword: (data: ResetPasswordFormData) => Promise<void>;
  t: (key: string) => string;
}

export function ResetPasswordContainer({
  children,
  token,
}: ResetPasswordContainerProps) {
  const t = useTranslations("");
  const resetPasswordMutation = useResetPassword();

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    await resetPasswordMutation.mutateAsync({
      token,
      newPassword: data.newPassword,
    });
  };

  return (
    <>
      {children({
        isLoading: resetPasswordMutation.isPending,
        handleResetPassword,
        t,
      })}
    </>
  );
}
