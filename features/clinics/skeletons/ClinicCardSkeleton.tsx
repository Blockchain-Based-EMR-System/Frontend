import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ClinicCardSkeleton() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Clinic Info Skeleton */}
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <Skeleton className="h-4 w-4 shrink-0 mt-0.5" />
            <Skeleton className="h-4 flex-1" />
          </div>
          <div className="flex items-start gap-2">
            <Skeleton className="h-4 w-4 shrink-0 mt-0.5" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 shrink-0" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 shrink-0" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>

        {/* Doctors Section Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
