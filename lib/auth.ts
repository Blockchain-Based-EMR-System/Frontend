import { User, Role } from "@/types";

export enum AuthState {
  UNAUTHENTICATED = "UNAUTHENTICATED",
  NEEDS_VERIFICATION = "NEEDS_VERIFICATION",
  NEEDS_PROFILE_COMPLETION = "NEEDS_PROFILE_COMPLETION",
  FULLY_AUTHENTICATED = "FULLY_AUTHENTICATED",
}

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

export function getRoleDashboardPath(role?: Role): string {
  if (!role) return "/dashboard"; 

  switch (role) {
    case Role.SUPER_ADMIN:
      return "/superadmin-dashboard";
    case Role.ADMIN:
      return "/admin-dashboard";
    case Role.DOCTOR:
      return "/doctor-dashboard";
    case Role.NURSE:
      return "/nurse-dashboard";
    case Role.PATIENT:
    default:
      return "/dashboard";
  }
}

export function hasAuthToken(): boolean {
  if (typeof window === "undefined") return false;
  const cookies = document.cookie.split(";");
  return cookies.some((cookie) => {
    const trimmed = cookie.trim();
    return trimmed.startsWith("UserState=");
  });
}

export function getAuthState(user: User | null): AuthState {
  if (!user || !hasAuthToken()) {
    return AuthState.UNAUTHENTICATED;
  }

  if (user.isVerified && user.hasCompletedProfile) {
    return AuthState.FULLY_AUTHENTICATED;
  }

  if (user.isVerified && !user.hasCompletedProfile) {
    return AuthState.NEEDS_PROFILE_COMPLETION;
  }

  if (!user.isVerified) {
    return AuthState.NEEDS_VERIFICATION;
  }

  return AuthState.UNAUTHENTICATED;
}

export function canAccessRoute(
  path: string,
  authState: AuthState,
  userRole?: Role
): { allowed: boolean; redirectTo?: string } {
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const verifyEmailRoute = "/verify-email";
  const completeProfileRoute = "/complete-profile";
  const dashboardRoute = userRole
    ? getRoleDashboardPath(userRole)
    : "/dashboard";

  const normalizedPath = path === "/" ? "/" : path.replace(/\/$/, "");

  if (authState === AuthState.FULLY_AUTHENTICATED && userRole) {
    if (
      normalizedPath.startsWith("/superadmin-dashboard") &&
      userRole !== Role.SUPER_ADMIN
    ) {
      return { allowed: false, redirectTo: getRoleDashboardPath(userRole) };
    }
    if (
      normalizedPath.startsWith("/admin-dashboard") &&
      userRole !== Role.ADMIN
    ) {
      return { allowed: false, redirectTo: getRoleDashboardPath(userRole) };
    }
    if (
      normalizedPath.startsWith("/doctor-dashboard") &&
      userRole !== Role.DOCTOR
    ) {
      return { allowed: false, redirectTo: getRoleDashboardPath(userRole) };
    }
    if (
      normalizedPath.startsWith("/nurse-dashboard") &&
      userRole !== Role.NURSE
    ) {
      return { allowed: false, redirectTo: getRoleDashboardPath(userRole) };
    }
  }

  switch (authState) {
    case AuthState.UNAUTHENTICATED:
      if (publicRoutes.includes(normalizedPath)) {
        return { allowed: true };
      }
      return { allowed: false, redirectTo: "/login" };

    case AuthState.NEEDS_PROFILE_COMPLETION:
      if (normalizedPath === completeProfileRoute) {
        return { allowed: true };
      }
      return { allowed: false, redirectTo: completeProfileRoute };

    case AuthState.NEEDS_VERIFICATION:
      if (normalizedPath === verifyEmailRoute) {
        return { allowed: true };
      }
      return { allowed: false, redirectTo: verifyEmailRoute };

    case AuthState.FULLY_AUTHENTICATED:
      if (publicRoutes.slice(1).includes(normalizedPath)) {
        return { allowed: false, redirectTo: dashboardRoute };
      }
      if (
        normalizedPath === completeProfileRoute ||
        normalizedPath === verifyEmailRoute
      ) {
        return { allowed: false, redirectTo: dashboardRoute };
      }
      return { allowed: true };

    default:
      return { allowed: false, redirectTo: "/login" };
  }
}

export function getRedirectAfterAuth(user: User | null): string {
  const authState = getAuthState(user);

  switch (authState) {
    case AuthState.NEEDS_VERIFICATION:
      return "/verify-email";
    case AuthState.NEEDS_PROFILE_COMPLETION:
      return "/complete-profile";
    case AuthState.FULLY_AUTHENTICATED:
      return user ? getRoleDashboardPath(user.role) : "/dashboard";
    default:
      return "/login";
  }
}