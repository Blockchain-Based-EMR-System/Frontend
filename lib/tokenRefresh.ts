export async function attemptTokenRefresh(): Promise<boolean> {
  try {
    console.log("🔄 [Token Refresh] Attempting client-side token refresh...");

    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();

      if (data?.data?.user) {
        console.log("📝 [Token Refresh] Syncing user data with store");

        if (typeof window !== "undefined") {
          const { useUserStore } = await import("@/stores/useUserStore");
          useUserStore.getState().setUser(data.data.user);
        }
      }

      return true;
    } else {
      const data = await response.json();
      console.error(
        "❌ [Token Refresh] Token refresh failed:",
        response.status,
        data,
      );
      return false;
    }
  } catch (error) {
    console.error("❌ [Token Refresh] Error during token refresh:", error);
    return false;
  }
}

export function shouldAttemptRefresh(): boolean {
  if (typeof document === "undefined") return false;

  const cookies = document.cookie.split(";");
  const hasRefreshToken = cookies.some((c) =>
    c.trim().startsWith("RefreshToken="),
  );
  const hasUserState = cookies.some((c) => c.trim().startsWith("UserState="));

  const shouldRefresh = hasRefreshToken && !hasUserState;

  if (shouldRefresh) {
    console.log(
      "⚠️ [Token Check] RefreshToken exists but UserState is missing - refresh needed",
    );
  }

  return shouldRefresh;
}
