import { Role } from "@/types/user";

export const getDashboardUrl = (role?: Role): string => {
  switch (role) {
    case Role.SUPER_ADMIN:
      return "/superadmin-dashboard";
    case Role.ADMIN:
      return "/admin-dashboard";
    case Role.DOCTOR:
    case Role.NURSE:
    case Role.PATIENT:
    default:
      return "/dashboard";
  }
};

export const getRoleDisplayName = (role?: Role): string => {
  switch (role) {
    case Role.SUPER_ADMIN:
      return "Super Admin";
    case Role.ADMIN:
      return "Admin";
    case Role.DOCTOR:
      return "Doctor";
    case Role.NURSE:
      return "Nurse";
    case Role.PATIENT:
      return "Patient";
    default:
      return "User";
  }
};
