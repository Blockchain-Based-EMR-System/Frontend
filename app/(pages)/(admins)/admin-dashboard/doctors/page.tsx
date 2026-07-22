"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Users } from "lucide-react";
import { navigationItems } from "@/constants/AdminNavigationItems";
import { DoctorListContainer } from "@/features/admins/admin/components/doctors/DoctorListContainer";

export default function AdminDashboardPage() {
  return (
    <Sidebar
      titleNameKey="admin"
      titleIcon={Users}
      navigationItems={navigationItems}
      translationNamespace="admin"
      dashboardHref="/admin-dashboard"
    >
      <DoctorListContainer />
    </Sidebar>
  );
}
