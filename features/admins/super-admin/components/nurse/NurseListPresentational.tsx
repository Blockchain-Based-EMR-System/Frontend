"use client";

import { Eye, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { getAccountStatusBadge } from "@/features/admins/utils";
import { Nurse } from "../../types/nurseTypes";

interface NurseListPresentationalProps {
  nurses: Nurse[];
  isLoading: boolean;
  onViewNurse: (nurse: Nurse) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

function NurseTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-9 w-40 bg-muted animate-pulse rounded-md" />
          <div className="h-5 w-56 bg-muted animate-pulse rounded-md" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
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
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="h-4 w-16 bg-muted animate-pulse rounded ml-auto" />
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
                      <div className="h-4 w-44 bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-16 bg-muted animate-pulse rounded" />
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
  );
}

export function NurseListPresentational({
  nurses,
  isLoading,
  onViewNurse,
  searchQuery,
  onSearchChange,
}: NurseListPresentationalProps) {
  const tCommon = useTranslations("common");
  const tAdmin = useTranslations("superAdmin");
  const tFields = useTranslations("fields");

  if (isLoading) {
    return <NurseTableSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {tAdmin("nurses")}
          </h1>
          <p className="text-muted-foreground">{tAdmin("manageNurses")}</p>
        </div>
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="ps-9 w-64"
            placeholder={tAdmin("searchByNameOrPhone")}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tFields("name")}</TableHead>
                  <TableHead>{tFields("email")}</TableHead>
                  <TableHead>{tFields("phoneNumber")}</TableHead>
                  <TableHead>{tFields("gender")}</TableHead>
                  <TableHead>{tCommon("accountStatus")}</TableHead>
                  <TableHead className="text-right">
                    {tCommon("actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nurses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {tAdmin("noNursesFound")}
                    </TableCell>
                  </TableRow>
                ) : (
                  nurses.map((nurse) => (
                    <TableRow key={nurse.id}>
                      <TableCell className="font-medium">
                        {nurse.name}
                      </TableCell>
                      <TableCell>{nurse.email}</TableCell>
                      <TableCell>{nurse.phone || "N/A"}</TableCell>
                      <TableCell>
                        {nurse.gender === "MALE"
                          ? tFields("male")
                          : nurse.gender === "FEMALE"
                            ? tFields("female")
                            : "N/A"}
                      </TableCell>
                      <TableCell>
                        {getAccountStatusBadge(
                          nurse.nurse?.account_status,
                          tCommon,
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewNurse(nurse)}
                          title={tCommon("view")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
