"use client";

import { useTranslations } from "next-intl";

export default function Home() {
  const tDashboard = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const tPatients = useTranslations("patients");

  return (
    <div className="p-8">
      {/* Demo Content */}
      <main className="max-w-4xl mx-auto space-y-6">
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-2xl font-semibold mb-4">{tDashboard("title")}</h2>
          <p className="text-muted-foreground">{tDashboard("description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg bg-card">
            <h3 className="font-semibold mb-2">{tCommon("patients")}</h3>
            <p className="text-sm text-muted-foreground">
              {tPatients("subtitle")}
            </p>
          </div>
          <div className="p-4 border rounded-lg bg-card">
            <h3 className="font-semibold mb-2">{tCommon("records")}</h3>
            <p className="text-sm text-muted-foreground">
              Medical records management
            </p>
          </div>
          <div className="p-4 border rounded-lg bg-card">
            <h3 className="font-semibold mb-2">{tCommon("settings")}</h3>
            <p className="text-sm text-muted-foreground">
              Configure your preferences
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
