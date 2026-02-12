"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Stethoscope, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBreakPoints } from "@/hooks/useBreakPoints";

type View = "doctors" | "clinics";

interface ClinicsSidebarProps {
  filters: React.ReactNode;
  className?: string;
}

export function ClinicsSidebar({ filters, className }: ClinicsSidebarProps) {
  const t = useTranslations("clinics");
  const { isDesktop } = useBreakPoints();
  const [view, setView] = useQueryState(
    "view",
    parseAsStringEnum<View>(["doctors", "clinics"]).withDefault("doctors"),
  );
  const [filtersVisible, setFiltersVisible] = useState(false);

  useEffect(() => {
    if (isDesktop) {
      setFiltersVisible(true);
    } else {
      setFiltersVisible(false);
    }
    }, [isDesktop]);

  const toggleFilters = () => {
    setFiltersVisible((prev) => !prev);
  }

  return (
    <Card className={cn(
      "h-fit lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem-2.5rem)] lg:overflow-y-auto",
      className
    )}>
      <CardHeader>
        <CardTitle className="hidden lg:flex items-center gap-2">
          <Filter className="h-5 w-5" />
          {t("filters")}
        </CardTitle>
        <button className="flex lg:hidden items-center gap-2" onClick={toggleFilters}>
          <Filter className="h-5 w-5" />
          {t("filters")}
        </button>
      </CardHeader>
      { filtersVisible && 
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button
            variant={view === "doctors" ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => setView("doctors")}
          >
            <Stethoscope className="h-4 w-4 mr-2" />
            {t("viewDoctors")}
          </Button>
          <Button
            variant={view === "clinics" ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => setView("clinics")}
          >
            <Building2 className="h-4 w-4 mr-2" />
            {t("viewClinics")}
          </Button>
        </div>

        <div className="border-t my-4" />

        {filters}
      </CardContent>
        }
    </Card>
  );
}
