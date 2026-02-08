import { Stethoscope, LayoutDashboard, Building2 } from "lucide-react";

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
  {
    nameKey: "clinics",
    href: "/admin-dashboard/clinics",
    icon: Building2,
  },
];
