"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/features/dashboards/dashboard/api/dashboard.api";
import { useAuthSync } from "@/hooks/useAuthSync";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { updateAuthState } = useAuthSync();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const userData = await getCurrentUser();
        updateAuthState(userData);

        await new Promise((resolve) => setTimeout(resolve, 100));

        window.location.href = "/complete-profile";
      } catch (error) {
        console.error("Failed:", error);
        router.push("/login");
      }
    };

    handleGoogleCallback();
  }, [router, updateAuthState]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        <p className="text-lg font-medium">Completing Google Sign In...</p>
        <p className="text-sm text-muted-foreground mt-2">Please wait...</p>
      </div>
    </div>
  );
}
