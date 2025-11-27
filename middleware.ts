import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
  const hasAuthToken = !!authCookie?.value || !!refreshCookie?.value;

  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
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

  const userStateCookie = request.cookies.get("UserState");

  let isVerified = false;
  let hasCompletedProfile = false;

  if (userStateCookie?.value) {
    try {
      const userState = JSON.parse(decodeURIComponent(userStateCookie.value));
      isVerified = userState.isVerified || false;
      hasCompletedProfile = userState.hasCompletedProfile || false;
    } catch (error) {
      console.error("Failed:", error);
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
    if (authRoutes.includes(normalizedPath)) {
      return NextResponse.redirect(new URL(dashboardRoute, request.url));
    }
    if (
      normalizedPath === completeProfileRoute ||
      normalizedPath === verifyEmailRoute
    ) {
      return NextResponse.redirect(new URL(dashboardRoute, request.url));
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
