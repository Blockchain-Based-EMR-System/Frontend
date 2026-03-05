import {
  LayoutDashboard,
  Building2,
  Calendar,
  CalendarCheck,
  Plane,
  Megaphone,
} from "lucide-react";

export const doctorNavigationItems = [
  {
    nameKey: "dashboard",
    href: "/doctor-dashboard",
    icon: LayoutDashboard,
  },
  {
    nameKey: "clinicsTab",
    href: "/doctor-dashboard/clinics",
    icon: Building2,
  },
  {
    nameKey: "scheduleTab",
    href: "/doctor-dashboard/schedule",
    icon: Calendar,
  },
  {
    nameKey: "appointmentsTab",
    href: "/doctor-dashboard/appointments",
    icon: CalendarCheck,
  },
  {
    nameKey: "vacationTab",
    href: "/doctor-dashboard/vacation",
    icon: Plane,
  },
  {
    nameKey: "announcementsTab",
    href: "/doctor-dashboard/announcements",
    icon: Megaphone,
  },
];
