import {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  CalendarCheck,
} from "lucide-react";

export const nurseNavigationItems = [
  {
    nameKey: "dashboard",
    href: "/nurse-dashboard",
    icon: LayoutDashboard,
  },
  {
    nameKey: "applicationsTab",
    href: "/nurse-dashboard/applications",
    icon: ClipboardList,
  },
  {
    nameKey: "scheduleTab",
    href: "/nurse-dashboard/schedule",
    icon: Calendar,
  },
  {
    nameKey: "appointmentsTab",
    href: "/nurse-dashboard/appointments",
    icon: CalendarCheck,
  },
];
