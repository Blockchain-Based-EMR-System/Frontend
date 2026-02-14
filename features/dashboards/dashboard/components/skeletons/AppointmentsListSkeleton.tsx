import { AppointmentCardSkeleton } from "./AppointmentCardSkeleton";

export function AppointmentsListSkeleton() {
  return (
    <div className="space-y-6">
      {/* View Toggle Skeleton */}
      <div className="flex justify-center">
        <div className="inline-flex items-center rounded-lg border bg-muted p-1 gap-1">
          <div className="h-9 w-32 bg-background rounded-md" />
          <div className="h-9 w-32 bg-transparent rounded-md" />
        </div>
      </div>

      {/* Appointments Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2">
        <AppointmentCardSkeleton />
        <AppointmentCardSkeleton />
        <AppointmentCardSkeleton />
        <AppointmentCardSkeleton />
      </div>
    </div>
  );
}
