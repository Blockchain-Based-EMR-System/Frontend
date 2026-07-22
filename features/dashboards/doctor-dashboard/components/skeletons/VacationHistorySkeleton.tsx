"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function VacationHistorySkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Section Title */}
        <Skeleton className="h-4 w-40" />

        {/* Vacation Cards */}
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-3">
                  {/* Badge */}
                  <Skeleton className="h-5 w-20" />

                  {/* Date Range */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-64" />
                  </div>

                  {/* Days Off */}
                  <div className="flex items-start gap-2">
                    <Skeleton className="h-4 w-16" />
                    <div className="flex flex-wrap gap-1">
                      {[...Array(3)].map((_, idx) => (
                        <Skeleton key={idx} className="h-6 w-20" />
                      ))}
                    </div>
                  </div>

                  {/* Appointments Count */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>

                {/* Action Button */}
                <Skeleton className="h-8 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
