import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { cookies } from "next/headers";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { SocketProvider } from "@/contexts/SocketProvider";
import { QueryProvider } from "@/contexts/QueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { Navbar, Footer } from "@/components/layout";
import InteractiveBackground from "@/components/ui/interactive-background";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HoloCura",
  description: "One Platform. Complete Care.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as "en" | "ar") || "en";
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <ThemeProvider>
              <LanguageProvider initialLocale={locale}>
                <SocketProvider>
                  <NuqsAdapter>
                    <InteractiveBackground />
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <main className="grow flex flex-col">{children}</main>
                    </div>
                    <Footer />
                    <Toaster />
                  </NuqsAdapter>
                </SocketProvider>
              </LanguageProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
