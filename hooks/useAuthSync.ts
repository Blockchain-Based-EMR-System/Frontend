"use client";
import { useEffect, useCallback } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { User } from "@/types";
import { api } from "@/lib/apiClient";

interface RefreshResponse {
  data?: {
    user?: User;
  };
}

export function useAuthSync() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  useEffect(() => {
    if (user) {
      const userState = {
        isVerified: user.isVerified,
        hasCompletedProfile: user.hasCompletedProfile,
        role: user.role,
      };
      document.cookie = `UserState=${encodeURIComponent(
        JSON.stringify(userState)
      )}; path=/; max-age=2592000; SameSite=Lax`;
    } else {
      document.cookie =
        "UserState=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, [user]);


  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user-storage" && !e.newValue) {
        clearUser();
        document.cookie = "UserState=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [clearUser]);

  const refreshUserState = useCallback(async () => {
    try {
      const data = await api.post<RefreshResponse>("/api/auth/refresh");
      
      if (data?.data?.user) {
        const userData = data.data.user;
        setUser(userData);
        
        const userState = {
          isVerified: userData.isVerified,
          hasCompletedProfile: userData.hasCompletedProfile,
          role: userData.role,
        };
        document.cookie = `UserState=${encodeURIComponent(
          JSON.stringify(userState)
        )}; path=/; max-age=2592000; SameSite=Lax`;
        
        return userData;
      }
      
      clearUser();
      return null;
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
        role: userData.role,
      };
      const cookieString = `UserState=${encodeURIComponent(
        JSON.stringify(userState)
      )}; path=/; max-age=2592000; SameSite=Lax`;
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