import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const authCookie = request.cookies.get("Authorization");
    const refreshCookie = request.cookies.get("RefreshToken");

    if (!refreshCookie) {
      console.error(
        "❌ [Refresh Route] No refresh token found in request cookies",
      );
      const response = NextResponse.json(
        {
          messageEn: "No refresh token found",
          messageAr: "لم يتم العثور على رمز التحديث",
        },
        { status: 401 },
      );

      response.cookies.set("Authorization", "", { maxAge: 0, path: "/" });
      response.cookies.set("RefreshToken", "", { maxAge: 0, path: "/" });
      response.cookies.set("UserState", "", { maxAge: 0, path: "/" });
      response.cookies.set("AuthFailure", "true", { maxAge: 60, path: "/" });

      return response;
    }

    const cookieHeader = authCookie?.value
      ? `Authorization=${authCookie.value}; RefreshToken=${refreshCookie.value}`
      : `RefreshToken=${refreshCookie.value}`;

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error(
        "❌ [Refresh Route] Failed to parse backend response",
        parseError,
      );

      if (response.status === 401) {
        const errorResponse = NextResponse.json(
          {
            messageEn: "Invalid refresh token",
            messageAr: "رمز تحديث غير صالح",
          },
          { status: 401 },
        );
        errorResponse.cookies.set("Authorization", "", {
          maxAge: 0,
          path: "/",
        });
        errorResponse.cookies.set("RefreshToken", "", { maxAge: 0, path: "/" });
        errorResponse.cookies.set("UserState", "", { maxAge: 0, path: "/" });
        errorResponse.cookies.set("AuthFailure", "true", {
          maxAge: 60,
          path: "/",
        });
        return errorResponse;
      }

      return NextResponse.json(
        {
          messageEn: "Failed to process refresh response",
          messageAr: "فشل معالجة استجابة التحديث",
        },
        { status: 500 },
      );
    }

    if (!response.ok) {
      console.error(
        `❌ [Refresh Route] Backend refresh failed with status: ${response.status}`,
        data,
      );

      const errorResponse = NextResponse.json(data, {
        status: response.status,
      });

      if (response.status === 401) {
        console.error(
          "🔐 [Refresh Route] Unauthorized - clearing all auth cookies",
        );
        errorResponse.cookies.set("Authorization", "", {
          maxAge: 0,
          path: "/",
        });
        errorResponse.cookies.set("RefreshToken", "", { maxAge: 0, path: "/" });
        errorResponse.cookies.set("UserState", "", { maxAge: 0, path: "/" });
        errorResponse.cookies.set("AuthFailure", "true", {
          maxAge: 60,
          path: "/",
        });
      } else {
        console.warn(
          "⚠️ [Refresh Route] Backend error (not 401) - keeping cookies, might retry later",
        );
      }

      return errorResponse;
    }

    const nextResponse = NextResponse.json(data, { status: 200 });

    const setCookieHeaders = response.headers.getSetCookie();
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie, index) => {
        nextResponse.headers.append("Set-Cookie", cookie);

        const cookieMatch = cookie.match(/^([^=]+)=([^;]+)/);
        if (cookieMatch) {
          const [, name, value] = cookieMatch;

          const maxAgeMatch = cookie.match(/Max-Age=(\d+)/);
          const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1]) : undefined;

          nextResponse.cookies.set(name, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: maxAge,
          });
        }
      });
    } else {
      console.warn(
        "⚠️ [Refresh Route] No Set-Cookie headers from backend - cookies won't be updated!",
      );
      console.warn(
        "⚠️ [Refresh Route] Backend might not be setting cookies in response",
      );
    }

    if (data?.data?.user) {
      const user = data.data.user;
      const userState = {
        isVerified: user.isVerified,
        hasCompletedProfile: user.hasCompletedProfile,
        role: user.role,
      };

      nextResponse.cookies.set("UserState", JSON.stringify(userState), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      nextResponse.cookies.set("AuthFailure", "", { maxAge: 0, path: "/" });
    }

    return nextResponse;
  } catch (error) {
    console.error("❌ [Refresh Route] Unexpected error:", error);

    const isNetworkError =
      error instanceof TypeError && error.message.includes("fetch");

    if (isNetworkError) {
      console.error("🌐 [Refresh Route] Network error - backend might be down");
      return NextResponse.json(
        {
          messageEn: "Unable to connect to authentication server",
          messageAr: "غير قادر على الاتصال بخادم المصادقة",
        },
        { status: 503 },
      );
    }

    const errorResponse = NextResponse.json(
      {
        messageEn: "Failed to refresh token",
        messageAr: "فشل تحديث الرمز",
      },
      { status: 500 },
    );

    console.warn(
      "⚠️ [Refresh Route] Unexpected error - keeping cookies for potential retry",
    );

    return errorResponse;
  }
}
