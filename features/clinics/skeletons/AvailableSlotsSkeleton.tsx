import { Skeleton } from "@/components/ui/skeleton";

export function AvailableSlotsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
