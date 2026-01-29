import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

const namespaces = [
  "common",
  "auth",
  "dashboard",
  "patients",
  "records",
  "settings",
  "admin",
  "superAdmin",
  "doctor",
] as const;

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale =
    (cookieStore.get("NEXT_LOCALE")?.value as Locale) || defaultLocale;

  const messages: Record<string, any> = {};

  for (const namespace of namespaces) {
    messages[namespace] = (
      await import(`./locales/${locale}/${namespace}.json`)
    ).default;
  }

  return {
    locale,
    messages,
  };
});
