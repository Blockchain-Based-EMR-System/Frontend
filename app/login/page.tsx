"use client";

import { LoginContainer } from "./components/LoginContainer";
import { LoginPresentational } from "./components/LoginPresentational";

export default function LoginPage() {
  return (
    <LoginContainer>
      {(props) => <LoginPresentational {...props} />}
    </LoginContainer>
  );
}
