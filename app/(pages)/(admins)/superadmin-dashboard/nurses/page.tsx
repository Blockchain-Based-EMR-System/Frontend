"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Users } from "lucide-react";
import { navigationItems } from "@/constants/superAdminNavigationItems";
import { NurseListContainer } from "@/features/admins/super-admin/components/nurse/NurseListContainer";

export default function SuperAdminNursesPage() {
  return (
    <Sidebar
      titleNameKey="superAdmin"
      titleIcon={Users}
      navigationItems={navigationItems}
      translationNamespace="superAdmin"
      dashboardHref="/superadmin-dashboard"
    >
      <NurseListContainer />
    </Sidebar>
  );
}
