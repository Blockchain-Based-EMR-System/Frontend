"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { settingsNavigationItems } from "@/constants/SettingsNavigationItems";
import { Settings as SettingsIcon } from "lucide-react";

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <Sidebar
      titleNameKey="title"
      titleIcon={SettingsIcon}
      navigationItems={settingsNavigationItems}
      translationNamespace="settings"
      dashboardHref="/settings/profile"
    >
      {children}
    </Sidebar>
  );
}
