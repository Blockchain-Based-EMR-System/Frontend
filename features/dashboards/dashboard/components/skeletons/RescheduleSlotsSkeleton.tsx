import { Skeleton } from "@/components/ui/skeleton";

export function RescheduleSlotsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[...Array(9)].map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  );
}
