import Cookies from "js-cookie";

const TOKEN_COOKIE_NAME = "auth_token";
const isProduction = process.env.NODE_ENV === "production";

export const getAuthToken = (): string | undefined => {
  return Cookies.get(TOKEN_COOKIE_NAME);
};

export const setAuthToken = (
  token: string,
  expiresInDays: number = 7
): void => {
  Cookies.set(TOKEN_COOKIE_NAME, token, {
    expires: expiresInDays,
    secure: isProduction, // HTTPS only in production
    sameSite: "strict",
    path: "/",
  });
};

export const removeAuthToken = (): void => {
  Cookies.remove(TOKEN_COOKIE_NAME, { path: "/" });
};