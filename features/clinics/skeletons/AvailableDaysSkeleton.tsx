import { Skeleton } from "@/components/ui/skeleton";

export function AvailableDaysSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-10 w-10 shrink-0" />
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 w-24 shrink-0" />
          ))}
        </div>
      </div>
      <Skeleton className="h-10 w-10 shrink-0" />
    </div>
  );
}
