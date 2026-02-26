import { Skeleton } from "@/components/ui/skeleton";

export function RescheduleDatesSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-10 w-10 shrink-0" />
      <div className="flex-1">
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1">
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      </div>
      <Skeleton className="h-10 w-10 shrink-0" />
    </div>
  );
}
