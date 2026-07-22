import { LayoutDashboard, CalendarCheck, FileText } from "lucide-react";

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
  {
    nameKey: "medicalHistoryTab",
    href: "/dashboard/medical-history",
    icon: FileText,
  },
];
