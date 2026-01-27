import {
  Stethoscope,
  LayoutDashboard,
  UserCog,
} from "lucide-react";

export const navigationItems = [
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