"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function VacationTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Date Range Picker */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-72" />
        </CardContent>
      </Card>

      {/* Schedules Selection */}
      <div>
        <Skeleton className="h-6 w-64 mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
}
