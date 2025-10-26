"use client";

import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";

export default function Home() {
  const t = useTranslations("");

  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t("welcome")}</h1>
        <div className="flex gap-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </header>

      {/* Demo Content */}
      <main className="max-w-4xl mx-auto space-y-6">
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-2xl font-semibold mb-4">{t("dashboard")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg bg-card">
            <h3 className="font-semibold mb-2">{t("patients")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("patientsSubtitle")}
            </p>
          </div>
          <div className="p-4 border rounded-lg bg-card">
            <h3 className="font-semibold mb-2">{t("records")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("recordsSubtitle")}
            </p>
          </div>
          <div className="p-4 border rounded-lg bg-card">
            <h3 className="font-semibold mb-2">{t("settings")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("settingsSubtitle")}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
