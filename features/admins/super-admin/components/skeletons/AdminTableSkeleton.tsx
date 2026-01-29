import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AdminTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-9 w-40 bg-muted animate-pulse rounded-md" />
          <div className="h-5 w-64 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="h-10 w-full md:w-32 bg-muted animate-pulse rounded-md" />
      </div>

      <div className="-mx-6 md:mx-0 p-6 md:p-0">
        <Card className="rounded-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table style={{ minWidth: "800px" }}>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    </TableHead>
                    <TableHead>
                      <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                    </TableHead>
                    <TableHead>
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    </TableHead>
                    <TableHead>
                      <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                    </TableHead>
                    <TableHead className="text-right">
                      <div className="h-4 w-20 bg-muted animate-pulse rounded ml-auto" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
