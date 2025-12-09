"use client";

import { useEffect, useCallback } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { User } from "@/types";

export function useAuthSync() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  useEffect(() => {
    if (user) {
      const userState = {
        isVerified: user.isVerified,
        hasCompletedProfile: user.hasCompletedProfile,
      };

      document.cookie = `UserState=${encodeURIComponent(
        JSON.stringify(userState)
      )}; path=/; max-age=2592000; SameSite=Lax`;
    } else {
      document.cookie =
        "UserState=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, [user]);


  const refreshUserState = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data?.user) {
          const userData = data.data.user;
          setUser(userData);

          const userState = {
            isVerified: userData.isVerified,
            hasCompletedProfile: userData.hasCompletedProfile,
          };
          document.cookie = `UserState=${encodeURIComponent(
            JSON.stringify(userState)
          )}; path=/; max-age=2592000; SameSite=Lax`;

          return userData;
        }
      } else {
        clearUser();
        return null;
      }
    } catch (error) {
      console.error("Failed to refresh user state:", error);
      clearUser();
      return null;
    }
  }, [setUser, clearUser]);

  const updateAuthState = useCallback(
    (userData: User) => {
      setUser(userData);

      const userState = {
        isVerified: userData.isVerified,
        hasCompletedProfile: userData.hasCompletedProfile,
      };

      const cookieString = `UserState=${encodeURIComponent(
        JSON.stringify(userState)
      )}; path=/; max-age=2592000; SameSite=Lax`;
      console.log("🍪 Setting cookie:", cookieString);
      document.cookie = cookieString;

    },
    [setUser]
  );

  const clearAuthState = useCallback(() => {
    clearUser();
    document.cookie =
      "UserState=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }, [clearUser]);

  return {
    user,
    refreshUserState,
    updateAuthState,
    clearAuthState,
  };
}


