"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { DoctorListContainer } from "@/features/admins/super-admin";
import { Users, UserCog, LayoutDashboard, Stethoscope } from "lucide-react";

export default function DoctorsPage() {
  const navigationItems = [
    {
      nameKey: "dashboard",
      href: "/superadmin-dashboard",
      icon: LayoutDashboard,
    },
    {
      nameKey: "admins",
      href: "/superadmin-dashboard/admins",
      icon: UserCog,
    },
    {
      nameKey: "doctors",
      href: "/superadmin-dashboard/doctors",
      icon: Stethoscope,
    },
  ];

  return (
    <Sidebar
      titleNameKey="superAdmin"
      titleIcon={Users}
      navigationItems={navigationItems}
      translationNamespace="superAdmin"
      dashboardHref="/superadmin-dashboard"
    >
      <DoctorListContainer />
    </Sidebar>
  );
}
