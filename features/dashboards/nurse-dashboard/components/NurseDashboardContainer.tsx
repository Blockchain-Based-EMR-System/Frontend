"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { nurseNavigationItems } from "@/constants/NurseNavigationItems";
import { HeartPulse } from "lucide-react";
import { useNurseSocket } from "../hooks/useNurseSocket";

interface NurseDashboardContainerProps {
  children: ReactNode;
}

export function NurseDashboardContainer({
  children,
}: NurseDashboardContainerProps) {
  useNurseSocket();
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
