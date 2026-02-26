"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { patientNavigationItems } from "@/constants/PatientNavigationItems";
import { LayoutDashboard } from "lucide-react";

interface PatientDashboardLayoutProps {
  children: ReactNode;
}

export function PatientDashboardLayout({
  children,
}: PatientDashboardLayoutProps) {
  return (
    <Sidebar
      titleNameKey="dashboard"
      titleIcon={LayoutDashboard}
      navigationItems={patientNavigationItems}
      translationNamespace="userDashboard"
      dashboardHref="/dashboard"
    >
      {children}
    </Sidebar>
  );
}
