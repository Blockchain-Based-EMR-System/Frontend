"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { createVerifyEmailSchema } from "./VerifyEmailSchema";
import { OtpInput } from "@/components/ui/otp-input";

interface VerifyEmailFormProps {
  onSubmit: (data: VerifyEmailFormData) => Promise<void>;
  isLoading: boolean;
  onResendOtp: () => void;
  isResendDisabled: boolean;
  resendCountdown: number;
}

export interface VerifyEmailFormData {
  otp: string;
}

export function VerifyEmailForm({
  onSubmit,
  isLoading,
  onResendOtp,
  isResendDisabled,
  resendCountdown,
}: VerifyEmailFormProps) {
  const tAuth = useTranslations("auth");

  const {
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(createVerifyEmailSchema(tAuth)),
    defaultValues: {
      otp: "",
    },
  });

  const otpValue = watch("otp");

  const handleOtpChange = (value: string) => {
    setValue("otp", value, { shouldValidate: true });
    if (value.length === 6) {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col gap-4">
        <OtpInput
          length={6}
          value={otpValue}
          onChange={handleOtpChange}
          disabled={isLoading}
          error={!!errors.otp}
        />
        {errors.otp && (
          <p className="text-sm text-destructive text-center">
            {errors.otp.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || otpValue.length !== 6}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {tAuth("verifying")}
          </>
        ) : (
          tAuth("verifyEmail")
        )}
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          {tAuth("didntReceiveCode")}
        </p>
        <Button
          type="button"
          variant="link"
          onClick={onResendOtp}
          disabled={isResendDisabled}
          className="text-primary"
        >
          {isResendDisabled
            ? `${tAuth("resendOtp")} (${resendCountdown}s)`
            : tAuth("resendOtp")}
        </Button>
      </div>
    </form>
  );
}
