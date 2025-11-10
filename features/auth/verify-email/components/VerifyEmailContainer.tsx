"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { VerifyEmailFormData } from "./verifyEmailForm/VerifyEmailForm";
import { useVerifyEmail, useResendOtp } from "../query/useVerifyEmail.query";

export interface VerifyEmailContainerProps {
  children: (props: VerifyEmailPresentationalProps) => React.ReactNode;
}

export interface VerifyEmailPresentationalProps {
  isLoading: boolean;
  handleVerifyEmail: (data: VerifyEmailFormData) => Promise<void>;
  handleResendOtp: () => void;
  isResendDisabled: boolean;
  resendCountdown: number;
  t: (key: string) => string;
}

const RESEND_COOLDOWN = 60;

export function VerifyEmailContainer({ children }: VerifyEmailContainerProps) {
  const t = useTranslations("");
  const verifyEmailMutation = useVerifyEmail();
  const resendOtpMutation = useResendOtp();

  const [resendCountdown, setResendCountdown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleVerifyEmail = async (data: VerifyEmailFormData) => {
    await verifyEmailMutation.mutateAsync({
      otp: data.otp,
    });
  };

  const handleResendOtp = () => {
    resendOtpMutation.mutate();
    setIsResendDisabled(true);
    setResendCountdown(RESEND_COOLDOWN);
  };

  return (
    <>
      {children({
        isLoading: verifyEmailMutation.isPending,
        handleVerifyEmail,
        handleResendOtp,
        isResendDisabled,
        resendCountdown,
        t,
      })}
    </>
  );
}
