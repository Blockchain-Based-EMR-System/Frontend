"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { doctorNavigationItems } from "@/constants/DoctorNavigationItems";
import { Stethoscope } from "lucide-react";
import { useDoctorSocket } from "../hooks/useDoctorSocket";

interface DoctorDashboardContainerProps {
  children: ReactNode;
}

export function DoctorDashboardContainer({
  children,
}: DoctorDashboardContainerProps) {
  return (
    <Sidebar
      titleNameKey="title"
      titleIcon={Stethoscope}
      navigationItems={doctorNavigationItems}
      translationNamespace="doctorDashboard"
      dashboardHref="/doctor-dashboard"
    >
      {children}
    </Sidebar>
  );
}
