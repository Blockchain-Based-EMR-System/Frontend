"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ResetPasswordContainer,
  ResetPasswordPresentational,
} from "@/features/auth/password";
import { useTranslations } from "next-intl";
import { toast } from "@/hooks/useToast";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("invalidResetToken"),
      });
      router.push("/login");
    }
  }, [token, router, t]);

  if (!token) {
    return null;
  }

  return (
    <ResetPasswordContainer token={token}>
      {(props) => <ResetPasswordPresentational {...props} />}
    </ResetPasswordContainer>
  );
}
