"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users2, Clock } from "lucide-react";
import { useQueueStore } from "@/stores/useQueueStore";

interface QueueStatusCardProps {
  appointmentId: string;
  tDashboard: (key: string, params?: Record<string, string | number>) => string;
}

export function QueueStatusCard({
  appointmentId,
  tDashboard,
}: QueueStatusCardProps) {
  const entry = useQueueStore((state) => state.getEntry(appointmentId));

  if (!entry) return null;

  const patientsAhead = Math.max(0, entry.position - 1);
  const filledDots = Math.min(patientsAhead, 5);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users2 className="h-5 w-5 text-primary" />
          {tDashboard("socket.queuePosition", { position: entry.position })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full transition-colors ${
                i < filledDots ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {tDashboard("socket.queueAhead", { count: patientsAhead })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {tDashboard("socket.queueWait", {
              minutes: entry.estimatedWaitMinutes,
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
