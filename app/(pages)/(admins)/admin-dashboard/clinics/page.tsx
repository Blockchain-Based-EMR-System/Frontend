"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { ClinicListContainer } from "@/features/admins/admin";
import { Shield } from "lucide-react";
import { navigationItems } from "@/constants/AdminNavigationItems";

export default function ClinicsPage() {
  return (
    <Sidebar
      titleNameKey="admin"
      titleIcon={Shield}
      navigationItems={navigationItems}
      translationNamespace="admin"
      dashboardHref="/admin-dashboard"
    >
      <ClinicListContainer />
    </Sidebar>
  );
}
