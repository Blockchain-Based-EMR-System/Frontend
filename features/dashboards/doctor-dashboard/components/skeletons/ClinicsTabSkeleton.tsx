"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ClinicsTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Clinic Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Skeleton className="h-4 w-4 mt-1" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex items-start gap-2">
                <Skeleton className="h-4 w-4 mt-1" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-start gap-2">
                <Skeleton className="h-4 w-4 mt-1" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="pt-2">
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
