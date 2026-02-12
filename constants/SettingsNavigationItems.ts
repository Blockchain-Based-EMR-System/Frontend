import { User, KeyRound } from "lucide-react";

export const settingsNavigationItems = [
  {
    nameKey: "updateProfile",
    href: "/settings/profile",
    icon: User,
  },
  {
    nameKey: "changePassword",
    href: "/settings/change-password",
    icon: KeyRound,
  },
];
