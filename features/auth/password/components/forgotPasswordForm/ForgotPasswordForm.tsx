"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { Loader2, Mail } from "lucide-react";
import { createForgotPasswordSchema } from "./ForgotPasswordSchema";

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>;
  isLoading: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export function ForgotPasswordForm({
  onSubmit,
  isLoading,
}: ForgotPasswordFormProps) {
  const tFields = useTranslations("fields");
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(createForgotPasswordSchema(tFields)),
    defaultValues: {
      email: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{tFields("email")}</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder={tFields("emailPlaceholder")}
            {...register("email")}
            disabled={isLoading}
            aria-invalid={!!errors.email}
            className="py-5 pl-10"
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {tCommon("sending")}
          </>
        ) : (
          tAuth("sendResetLink")
        )}
      </Button>
    </form>
  );
}
