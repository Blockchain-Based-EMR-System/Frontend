"use client";

import { VerifyEmailContainer } from "@/features/auth/verify-email/components/VerifyEmailContainer";
import { VerifyEmailPresentational } from "@/features/auth/verify-email/components/VerifyEmailPresentational";

export default function VerifyEmailPage() {
  return (
    <VerifyEmailContainer>
      {(props) => <VerifyEmailPresentational {...props} />}
    </VerifyEmailContainer>
  );
}
