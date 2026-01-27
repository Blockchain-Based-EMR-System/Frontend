"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { AdminListContainer } from "@/features/admins/super-admin";
import { Users} from "lucide-react";
import { navigationItems } from "@/constants/superAdminNavigationItems";

export default function AdminsPage() {

  return (
    <Sidebar
      titleNameKey="superAdmin"
      titleIcon={Users}
      navigationItems={navigationItems}
      translationNamespace="superAdmin"
      dashboardHref="/superadmin-dashboard"
    >
      <AdminListContainer />
    </Sidebar>
  );
}
