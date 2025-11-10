"use client";

import { RegisterContainer } from "@/features/auth/register/components/RegisterContainer";
import { RegisterPresentational } from "@/features/auth/register/components/RegisterPresentational";

export default function RegisterPage() {
  return (
    <RegisterContainer>
      {(props) => <RegisterPresentational {...props} />}
    </RegisterContainer>
  );
}
