"use client";

import { RegisterContainer } from "@/features/register/components/RegisterContainer";
import { RegisterPresentational } from "@/features/register/components/RegisterPresentational";

export default function RegisterPage() {
  return (
    <RegisterContainer>
      {(props) => <RegisterPresentational {...props} />}
    </RegisterContainer>
  );
}
