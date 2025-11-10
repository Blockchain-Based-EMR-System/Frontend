"use client";

import { LoginContainer } from "@/features/auth/login/components/LoginContainer";
import { LoginPresentational } from "@/features/auth/login/components/LoginPresentational";

export default function LoginPage() {
  return (
    <>
      <LoginContainer>
        {(props) => <LoginPresentational {...props} />}
      </LoginContainer>
    </>
  );
}
