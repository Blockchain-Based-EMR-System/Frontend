import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const authCookie = request.cookies.get("Authorization");
    const refreshCookie = request.cookies.get("RefreshToken");

    if (!refreshCookie) {
      return NextResponse.json(
        {
          messageEn: "No refresh token found",
          messageAr: "لم يتم العثور على رمز التحديث",
        },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `Authorization=${authCookie?.value || ""}; RefreshToken=${
          refreshCookie.value
        }`,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const nextResponse = NextResponse.json(data, { status: 200 });

    const setCookieHeaders = response.headers.getSetCookie();
    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie) => {
        nextResponse.headers.append("Set-Cookie", cookie);
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      {
        messageEn: "Failed to refresh token",
        messageAr: "فشل تحديث الرمز",
      },
      { status: 500 }
    );
  }
}
