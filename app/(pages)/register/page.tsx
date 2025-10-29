"use client";

import { RegisterContainer } from "./components/RegisterContainer";
import { RegisterPresentational } from "./components/RegisterPresentational";

export default function RegisterPage() {
  return (
    <RegisterContainer>
      {(props) => <RegisterPresentational {...props} />}
    </RegisterContainer>
  );
}
