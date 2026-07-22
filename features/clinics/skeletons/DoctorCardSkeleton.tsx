import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DoctorCardSkeleton() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Doctor Avatar Skeleton */}
          <Skeleton className="h-20 w-20 rounded-full shrink-0" />

          {/* Doctor Info Skeleton */}
          <div className="flex-1 space-y-2">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-36" />
            </div>

            {/* Stats Skeleton */}
            <div className="flex gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Fees Skeleton */}
            <Skeleton className="h-5 w-24" />
          </div>
        </div>

        {/* Divider */}
        <div className="my-4">
          <Skeleton className="h-px w-full" />
        </div>

        {/* Clinics Section Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>

        {/* Online Button Skeleton */}
        <div className="mt-4">
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
