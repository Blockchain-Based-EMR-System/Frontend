"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Users } from "lucide-react";
import { navigationItems } from "@/constants/AdminNavigationItems";
import { NurseListContainer } from "@/features/admins/admin/components/nurses/NurseListContainer";

export default function AdminNursesPage() {
  return (
    <Sidebar
      titleNameKey="admin"
      titleIcon={Users}
      navigationItems={navigationItems}
      translationNamespace="admin"
      dashboardHref="/admin-dashboard"
    >
      <NurseListContainer />
    </Sidebar>
  );
}
