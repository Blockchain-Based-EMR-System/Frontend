import { LayoutDashboard, CalendarCheck } from "lucide-react";

export const patientNavigationItems = [
  {
    nameKey: "dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    nameKey: "appointmentsTab",
    href: "/dashboard/appointments",
    icon: CalendarCheck,
  },
];
