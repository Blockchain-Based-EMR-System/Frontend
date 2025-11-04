"use client";

import { LoginContainer } from "@/features/login/components/LoginContainer";
import { LoginPresentational } from "@/features/login/components/LoginPresentational";

export default function LoginPage() {
  return (
    <LoginContainer>
      {(props) => <LoginPresentational {...props} />}
    </LoginContainer>
  );
}
