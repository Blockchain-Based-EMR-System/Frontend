"use client";

import {
  ForgotPasswordContainer,
  ForgotPasswordPresentational,
} from "@/features/auth/password";

export default function ForgotPasswordPage() {
  return (
    <ForgotPasswordContainer>
      {(props) => <ForgotPasswordPresentational {...props} />}
    </ForgotPasswordContainer>
  );
}
