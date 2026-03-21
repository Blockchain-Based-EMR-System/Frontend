"use client";

import InteractiveBackground from "@/components/ui/interactive-background";
import { useUiPreferences } from "@/contexts/UiPreferencesProvider";

export function InteractiveBackgroundLayer() {
  const { interactiveBackgroundEnabled, mounted } = useUiPreferences();

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full -z-20 pointer-events-none bg-linear-to-br from-background to-muted" />
      {interactiveBackgroundEnabled ? <InteractiveBackground /> : null}
    </>
  );
}
