import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types/common";

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
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
