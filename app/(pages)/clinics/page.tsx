"use client";

import { parseAsStringEnum, useQueryState } from "nuqs";
import {
  ClinicsSidebar,
  DoctorsView,
  ClinicsView,
  DoctorsFilters,
  ClinicsFilters,
} from "@/features/clinics";

type View = "doctors" | "clinics";

export default function ClinicsPage() {
  const [view] = useQueryState(
    "view",
    parseAsStringEnum<View>(["doctors", "clinics"]).withDefault("doctors"),
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-start">
        <aside className="lg:col-span-1 lg:self-stretch">
          <ClinicsSidebar
            filters={
              view === "doctors" ? <DoctorsFilters /> : <ClinicsFilters />
            }
          />
        </aside>

        <main className="lg:col-span-3">
          {view === "doctors" ? <DoctorsView /> : <ClinicsView />}
        </main>
      </div>
    </div>
  );
}
