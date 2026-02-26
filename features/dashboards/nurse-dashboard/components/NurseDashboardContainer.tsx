"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { nurseNavigationItems } from "@/constants/NurseNavigationItems";
import { HeartPulse } from "lucide-react";

interface NurseDashboardContainerProps {
  children: ReactNode;
}

export function NurseDashboardContainer({
  children,
}: NurseDashboardContainerProps) {
  return (
    <Sidebar
      titleNameKey="title"
      titleIcon={HeartPulse}
      navigationItems={nurseNavigationItems}
      translationNamespace="nurseDashboard"
      dashboardHref="/nurse-dashboard"
    >
      {children}
    </Sidebar>
  );
}
