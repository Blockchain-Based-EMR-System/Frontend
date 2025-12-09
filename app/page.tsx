"use client";

import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("");

  return (
    <div className="p-8">
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
