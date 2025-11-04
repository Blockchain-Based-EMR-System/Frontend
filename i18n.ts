import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export default getRequestConfig(async () => {
  // Get locale from cookie (no URL locale needed)
  const cookieStore = await cookies();
  const locale =
    (cookieStore.get("NEXT_LOCALE")?.value as Locale) || defaultLocale;

  return {
    locale,
    messages: {
      ...(await import(`./locales/${locale}/common.json`)).default,
      ...(await import(`./locales/${locale}/auth.json`)).default,
      ...(await import(`./locales/${locale}/dashboard.json`)).default,
      ...(await import(`./locales/${locale}/patients.json`)).default,
      ...(await import(`./locales/${locale}/records.json`)).default,
      ...(await import(`./locales/${locale}/settings.json`)).default,
    },
  };
});
