"use client";

import {
  CompleteProfileForm,
  CompleteProfileFormData,
} from "./completeProfileForm/CompleteProfileForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCircle } from "lucide-react";

export interface CompleteProfilePresentationalProps {
  isLoading: boolean;
  handleCompleteProfile: (data: CompleteProfileFormData) => Promise<void>;
  requirePhone: boolean;
  initialPhone: string;
  t: (key: string) => string;
}

export function CompleteProfilePresentational({
  isLoading,
  handleCompleteProfile,
  requirePhone,
  initialPhone,
  t,
}: CompleteProfilePresentationalProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <UserCircle className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {t("completeYourProfile")}
          </CardTitle>
          <CardDescription className="text-base">
            {requirePhone
              ? t("completeProfileDescriptionWithPhone")
              : t("completeProfileDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CompleteProfileForm
            onSubmit={handleCompleteProfile}
            isLoading={isLoading}
            requirePhone={requirePhone}
            initialPhone={initialPhone}
          />
        </CardContent>
      </Card>
    </div>
  );
}
