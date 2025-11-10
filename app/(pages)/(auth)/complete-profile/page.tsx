"use client";

import { CompleteProfileContainer } from "@/features/auth/complete-profile/components/CompleteProfileContainer";
import { CompleteProfilePresentational } from "@/features/auth/complete-profile/components/CompleteProfilePresentational";
import { useEffect, useState } from "react";
import { useAuthFlowStore } from "@/stores/useAuthFlowStore";
import { useUserStore } from "@/stores/useUserStore";
import { getCurrentUser } from "@/features/dashboard/api/dashboard.api";

export default function CompleteProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const signupMethod = useAuthFlowStore((state) => state.signupMethod);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const hasHydrated = useUserStore((state) => state._hasHydrated);

  useEffect(() => {
    const initializeUser = async () => {
      if (!hasHydrated) return;

      // If user data doesn't exist (Google OAuth case), fetch it from backend
      if (!user || !user.email) {
        console.log("🔄 No user data in store, fetching from backend...");
        try {
          const userData = await getCurrentUser();
          console.log("✅ User data fetched:", userData);
          setUser(userData);
        } catch (error) {
          console.error("❌ Failed to fetch user data:", error);
          // Continue anyway - user might be from email signup
        }
      }

      setIsLoading(false);
    };

    initializeUser();
  }, [hasHydrated, user, setUser]);

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
