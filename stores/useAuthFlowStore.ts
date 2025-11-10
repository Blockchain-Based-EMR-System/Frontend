import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type SignupMethod = "email" | "google" | null;

interface AuthFlowState {
  signupMethod: SignupMethod;

  // Actions
  setSignupMethod: (method: SignupMethod) => void;
  clearSignupMethod: () => void;
}

export const useAuthFlowStore = create<AuthFlowState>()(
  persist(
    (set) => ({
      signupMethod: null,

      setSignupMethod: (method: SignupMethod) => {
        set({ signupMethod: method });
      },

      clearSignupMethod: () => {
        set({ signupMethod: null });
      },
    }),
    {
      name: "auth-flow-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
