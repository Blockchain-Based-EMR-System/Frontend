import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {

  try {
    const cookieStore = await cookies();

    const authToken = cookieStore.get("Authorization")?.value;
    const refreshToken = cookieStore.get("RefreshToken")?.value;

    if (!authToken && !refreshToken) {
      console.error("No auth tokens found in callback");
      return NextResponse.redirect(
        new URL("/login?error=auth_failed", request.url)
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const baseUrl = apiUrl?.replace(/\/api$/, "") || "http://localhost:3000";
    const userDataUrl = `${baseUrl}/auth/google/userData`;

    let userState = {
      isVerified: true,
      hasCompletedProfile: false,
    };

    try {
      const userResponse = await fetch(userDataUrl, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          ...(refreshToken ? { Cookie: `RefreshToken=${refreshToken}` } : {}),
        },
        credentials: "include",
      });

      if (userResponse.ok) {
        const responseData = await userResponse.json();
        const userData = responseData.data;

        userState = {
          isVerified: userData.isVerified !== false, 
          hasCompletedProfile: userData.hasCompletedProfile || false,
        };

      } else {
        const errorText = await userResponse.text();
        console.warn("Error response:", errorText);
      }
    } catch (error) {
      console.error("Error fetching:", error);
    }
    const redirectUrl = userState.hasCompletedProfile
      ? "/dashboard"
      : "/complete-profile";

    const response = NextResponse.redirect(new URL(redirectUrl, request.url));

    response.cookies.set("UserState", JSON.stringify(userState), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/login?error=callback_failed", request.url)
    );
  }
}
