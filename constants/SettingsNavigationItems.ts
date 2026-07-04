import { User, KeyRound, SlidersHorizontal } from "lucide-react";

export const settingsNavigationItems = [
  {
    nameKey: "generalSettings",
    href: "/settings/general",
    icon: SlidersHorizontal,
  },
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
