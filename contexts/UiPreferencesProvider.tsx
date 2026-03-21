"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface UiPreferencesContextType {
  interactiveBackgroundEnabled: boolean;
  setInteractiveBackgroundEnabled: (enabled: boolean) => void;
  mounted: boolean;
}

const UiPreferencesContext = createContext<
  UiPreferencesContextType | undefined
>(undefined);

const INTERACTIVE_BACKGROUND_KEY = "interactiveBackgroundEnabled";

export function UiPreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [interactiveBackgroundEnabled, setInteractiveBackgroundEnabledState] =
    useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedPreference = localStorage.getItem(INTERACTIVE_BACKGROUND_KEY);
    if (savedPreference !== null) {
      setInteractiveBackgroundEnabledState(savedPreference === "true");
    }
  }, []);

  const setInteractiveBackgroundEnabled = (enabled: boolean) => {
    setInteractiveBackgroundEnabledState(enabled);
    localStorage.setItem(INTERACTIVE_BACKGROUND_KEY, String(enabled));
  };

  return (
    <UiPreferencesContext.Provider
      value={{
        interactiveBackgroundEnabled,
        setInteractiveBackgroundEnabled,
        mounted,
      }}
    >
      {children}
    </UiPreferencesContext.Provider>
  );
}

export function useUiPreferences() {
  const context = useContext(UiPreferencesContext);
  if (context === undefined) {
    throw new Error(
      "useUiPreferences must be used within a UiPreferencesProvider",
    );
  }
  return context;
}
