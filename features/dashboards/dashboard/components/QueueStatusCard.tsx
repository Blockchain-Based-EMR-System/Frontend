"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useQueueStore } from "@/stores/useQueueStore";
import { useLanguage } from "@/contexts/LanguageProvider";

interface QueueStatusCardProps {
  appointmentId: string;
  tDashboard: (key: string, params?: Record<string, string | number>) => string;
}

export function QueueStatusCard({ appointmentId, tDashboard }: QueueStatusCardProps) {
  const entry = useQueueStore((state) => state.getEntry(appointmentId));
  const { locale } = useLanguage();

  if (!entry) {
    return (
      <Card className="border-border/40">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-2 rounded-full bg-muted-foreground/30" />
              {tDashboard("socket.queueWaiting")}
            </div>
            <span className="rounded-full bg-muted px-3 py-0.5 text-[11px] font-medium text-muted-foreground">
              {locale === "en" ? "Offline" : "غير متصل"}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" />
            <span>{tDashboard("socket.queueNotStarted")}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const patientsAhead = Math.max(0, entry.position - 1);

  return (
    <Card className="border-border/40">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-50" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {tDashboard("socket.queueWaiting")}
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-0.5 text-[11px] font-medium text-primary">
            {locale === "en" ? "Live" : "مباشر"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Position + Wait time row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="-tracking-widest text-5xl font-medium leading-none text-primary">
              {entry.position}
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {locale === "en" ? "Your position" : "موقعك في الطابور"}
            </p>
          </div>

          <div className="h-12 w-px bg-border" />

          <div className="text-right">
            <p className="text-2xl font-medium leading-none tracking-tight">
              ~{entry.estimatedWaitMinutes} {locale === "en" ? "min" : "دقيقة"}
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {locale === "en" ? "Estimated wait time" : "وقت الانتظار المقدر"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <Clock className="size-3.5 shrink-0" />
          <span>
            {locale === "en" ? `${patientsAhead} patient(s) ahead` : `${patientsAhead} مريض في الانتظار`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}