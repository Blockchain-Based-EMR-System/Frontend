"use client";

import {
  ResetPasswordForm,
  ResetPasswordFormData,
} from "./resetPasswordForm/ResetPasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock } from "lucide-react";

export interface ResetPasswordPresentationalProps {
  isLoading: boolean;
  handleResetPassword: (data: ResetPasswordFormData) => Promise<void>;
  t: (key: string) => string;
}

export function ResetPasswordPresentational({
  isLoading,
  handleResetPassword,
  t,
}: ResetPasswordPresentationalProps) {
  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {t("resetPassword")}
          </CardTitle>
          <CardDescription className="text-base">
            {t("resetPasswordDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm
            onSubmit={handleResetPassword}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
