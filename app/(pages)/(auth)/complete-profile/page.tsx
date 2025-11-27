"use client";

import { CompleteProfileContainer } from "@/features/auth/complete-profile/components/CompleteProfileContainer";
import { CompleteProfilePresentational } from "@/features/auth/complete-profile/components/CompleteProfilePresentational";
import { useEffect, useState } from "react";
import { useAuthFlowStore } from "@/stores/useAuthFlowStore";
import { useAuthSync } from "@/hooks/useAuthSync";
import { getCurrentUser } from "@/features/dashboard/api/dashboard.api";

export default function CompleteProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const signupMethod = useAuthFlowStore((state) => state.signupMethod);
  const { user, updateAuthState } = useAuthSync();

  useEffect(() => {
    const initializeUser = async () => {
      const cookies = document.cookie;
      const hasAuthCookie =
        cookies.includes("Authorization=") || cookies.includes("RefreshToken=");
      const hasUserStateCookie = cookies.includes("UserState=");

      if (hasAuthCookie && !hasUserStateCookie) {
        try {
          const userData = await getCurrentUser();
          updateAuthState(userData);

          setTimeout(() => {
            window.location.reload();
          }, 100);
          return;
        } catch (error) {
          console.error("Failed:", error);
        }
      }

      if (!user || !user.email) {
        try {
          const userData = await getCurrentUser();
          updateAuthState(userData);

          setTimeout(() => {
            const cookies = document.cookie.split(";");
            const userStateCookie = cookies.find((c) =>
              c.trim().startsWith("UserState=")
            );
            console.log("🍪 UserState cookie:", userStateCookie);
          }, 50);
        } catch (error) {
          console.error("Failed:", error);
        }
      }
      setIsLoading(false);
    };

    initializeUser();
  }, [user, updateAuthState]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const requirePhone = signupMethod === "google" || !user?.phone;

  return (
    <CompleteProfileContainer
      userPhone={user?.phone || null}
      requirePhone={requirePhone}
    >
      {(props) => <CompleteProfilePresentational {...props} />}
    </CompleteProfileContainer>
  );
}
