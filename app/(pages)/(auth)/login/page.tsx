"use client";

import { useEffect } from "react";
import { LoginContainer } from "@/features/auth/login/components/LoginContainer";
import { LoginPresentational } from "@/features/auth/login/components/LoginPresentational";
import { useUserStore } from "@/stores/useUserStore";

export default function LoginPage() {

  const clearUser = useUserStore((state) => state.clearUser);
  
  useEffect(() => {
    const userStorage = localStorage.getItem('user-storage');
    if (userStorage) {
      try {
        const parsed = JSON.parse(userStorage);
        if (parsed?.state?.user) {          
          localStorage.removeItem('user-storage');
          document.cookie = "UserState=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";          
          clearUser();
        }
      } catch (error) {
        console.error("Error parsing user storage:", error);
      }
    }
  }, [clearUser]);

  return (
    <>
      <LoginContainer>
        {(props) => <LoginPresentational {...props} />}
      </LoginContainer>
    </>
  );
}
