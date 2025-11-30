"use client";

import {
  VerifyEmailForm,
  VerifyEmailFormData,
} from "./verifyEmailForm/VerifyEmailForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";

export interface VerifyEmailPresentationalProps {
  isLoading: boolean;
  handleVerifyEmail: (data: VerifyEmailFormData) => Promise<void>;
  handleResendOtp: () => void;
  isResendDisabled: boolean;
  resendCountdown: number;
  t: (key: string) => string;
}

export function VerifyEmailPresentational({
  isLoading,
  handleVerifyEmail,
  handleResendOtp,
  isResendDisabled,
  resendCountdown,
  t,
}: VerifyEmailPresentationalProps) {
  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {t("verifyYourEmail")}
          </CardTitle>
          <CardDescription className="text-base">
            {t("verifyEmailDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyEmailForm
            onSubmit={handleVerifyEmail}
            isLoading={isLoading}
            onResendOtp={handleResendOtp}
            isResendDisabled={isResendDisabled}
            resendCountdown={resendCountdown}
          />
        </CardContent>
      </Card>
    </div>
  );
}
