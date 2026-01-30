import {
  Stethoscope,
  LayoutDashboard
} from "lucide-react";

export const navigationItems = [
    {
      nameKey: "dashboard",
      href: "/admin-dashboard",
      icon: LayoutDashboard,
    },
    {
      nameKey: "doctors",
      href: "/admin-dashboard/doctors",
      icon: Stethoscope,
    },
  ];