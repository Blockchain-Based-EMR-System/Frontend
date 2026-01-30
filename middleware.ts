import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role } from "./types/user";
import { getRoleDashboardPath } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("Authorization");
  const refreshCookie = request.cookies.get("RefreshToken");
  const userStateCookie = request.cookies.get("UserState");
  const hasAuthToken = !!authCookie?.value || !!refreshCookie?.value;

  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/join/doctor"
  ];
  const completeProfileRoute = "/complete-profile";
  const verifyEmailRoute = "/verify-email";
  const dashboardRoute = "/dashboard";
  const googleCallbackRoute = "/google-callback";
  const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  if (refreshCookie?.value && !userStateCookie?.value && !authCookie?.value) {
    console.warn(
      "⚠️ [Middleware] Inconsistent cookie state detected: RefreshToken exists but UserState is missing",
    );
    console.log(
      "🔄 [Middleware] User needs to re-authenticate - redirecting to login",
    );

    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("RefreshToken", "", { maxAge: 0, path: "/" });
    response.cookies.set("Authorization", "", { maxAge: 0, path: "/" });
    response.cookies.set("UserState", "", { maxAge: 0, path: "/" });
    return response;
  }

  let isVerified = false;
  let hasCompletedProfile = false;
  let userRole: Role | null = null;

  if (userStateCookie?.value) {
    try {
      const userState = JSON.parse(decodeURIComponent(userStateCookie.value));
      isVerified = userState.isVerified || false;
      hasCompletedProfile = userState.hasCompletedProfile || false;
      userRole = userState.role || null;
    } catch (error) {
      console.error("[Middleware] Failed to parse UserState cookie:", error);
      if (hasAuthToken) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.set("RefreshToken", "", { maxAge: 0, path: "/" });
        response.cookies.set("Authorization", "", { maxAge: 0, path: "/" });
        response.cookies.set("UserState", "", { maxAge: 0, path: "/" });
        return response;
      }
    }
  }

  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/$/, "");

  if (normalizedPath === googleCallbackRoute) {
    return NextResponse.next();
  }

  if (!hasAuthToken) {
    if (publicRoutes.includes(normalizedPath)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isVerified && hasCompletedProfile) {
    const userDashboard = userRole
      ? getRoleDashboardPath(userRole)
      : dashboardRoute;

    if (authRoutes.includes(normalizedPath)) {
      return NextResponse.redirect(new URL(userDashboard, request.url));
    }

    if (
      normalizedPath === completeProfileRoute ||
      normalizedPath === verifyEmailRoute
    ) {
      return NextResponse.redirect(new URL(userDashboard, request.url));
    }

    if (userRole) {
      if (
        normalizedPath.startsWith("/superadmin-dashboard") &&
        userRole !== Role.SUPER_ADMIN
      ) {
        return NextResponse.redirect(
          new URL(getRoleDashboardPath(userRole), request.url),
        );
      }
      if (
        normalizedPath.startsWith("/admin-dashboard") &&
        userRole !== Role.ADMIN
      ) {
        return NextResponse.redirect(
          new URL(getRoleDashboardPath(userRole), request.url),
        );
      }
      if (
        normalizedPath.startsWith("/doctor-dashboard") &&
        userRole !== Role.DOCTOR
      ) {
        return NextResponse.redirect(
          new URL(getRoleDashboardPath(userRole), request.url),
        );
      }
      if (
        normalizedPath.startsWith("/nurse-dashboard") &&
        userRole !== Role.NURSE
      ) {
        return NextResponse.redirect(
          new URL(getRoleDashboardPath(userRole), request.url),
        );
      }
      if (normalizedPath === "/dashboard" && userRole !== Role.PATIENT) {
        return NextResponse.redirect(
          new URL(getRoleDashboardPath(userRole), request.url),
        );
      }
    }

    return NextResponse.next();
  }

  if (isVerified && !hasCompletedProfile) {
    if (normalizedPath === completeProfileRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(completeProfileRoute, request.url));
  }

  if (!isVerified) {
    if (normalizedPath === verifyEmailRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(verifyEmailRoute, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
