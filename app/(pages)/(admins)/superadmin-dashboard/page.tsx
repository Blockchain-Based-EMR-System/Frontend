"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Users } from "lucide-react";
import { navigationItems } from "@/constants/superAdminNavigationItems";
import { DashboardContainer } from "@/features/admins/super-admin/components/dashboard/DashboardContainer";

export default function SuperAdminDashboardPage() {
  return (
    <Sidebar
      titleNameKey="superAdmin"
      titleIcon={Users}
      navigationItems={navigationItems}
      translationNamespace="superAdmin"
      dashboardHref="/superadmin-dashboard"
    >
      <DashboardContainer />
    </Sidebar>
  );
}
