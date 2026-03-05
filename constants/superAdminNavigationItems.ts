import {
  Stethoscope,
  LayoutDashboard,
  UserCog,
  Building2,
  HeartPulse,
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
  {
    nameKey: "clinics",
    href: "/superadmin-dashboard/clinics",
    icon: Building2,
  },
  {
    nameKey: "nurses",
    href: "/superadmin-dashboard/nurses",
    icon: HeartPulse,
  },
];
