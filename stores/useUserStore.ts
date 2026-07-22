import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types";
import { shouldAttemptRefresh, attemptTokenRefresh } from "@/lib/tokenRefresh";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;

  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  setHasHydrated: (state: boolean) => void;

  getUser: () => User | null;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          set({ user: updatedUser });
        }
      },

      clearUser: () => {
        set({ user: null, isAuthenticated: false });
      },

      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },

      getUser: () => {
        return get().user;
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => async (state) => {
        if (state) {
          state.setHasHydrated(true);
          if (shouldAttemptRefresh()) {
            const refreshSuccess = await attemptTokenRefresh();

            if (!refreshSuccess) {
              state.clearUser();

              if (
                typeof window !== "undefined" &&
                window.location.pathname !== "/login"
              ) {
                window.location.replace("/login");
              }
            } else {
              console.log(
                "✅ [Zustand] Auto-refresh successful - reloading to update state",
              );
              if (typeof window !== "undefined") {
                window.location.reload();
              }
            }
          }
        }
      },
    },
  ),
);
