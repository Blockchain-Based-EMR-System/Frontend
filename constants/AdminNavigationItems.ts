import {
  Stethoscope,
  LayoutDashboard,
  Building2,
  HeartPulse,
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
  {
    nameKey: "clinics",
    href: "/admin-dashboard/clinics",
    icon: Building2,
  },
  {
    nameKey: "nurses",
    href: "/admin-dashboard/nurses",
    icon: HeartPulse,
  },
];
