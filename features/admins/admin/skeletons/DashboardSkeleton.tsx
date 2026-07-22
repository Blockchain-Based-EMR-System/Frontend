import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-9 w-48 bg-muted animate-pulse rounded-md mb-2" />
        <div className="h-5 w-64 bg-muted animate-pulse rounded-md" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-28 bg-muted animate-pulse rounded-md" />
              <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
