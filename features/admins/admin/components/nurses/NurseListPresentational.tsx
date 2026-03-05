"use client";

import { Eye, CheckCircle, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import { Nurse } from "../../types/nurse.types";

interface NurseListPresentationalProps {
  nurses: Nurse[];
  isLoading: boolean;
  onViewNurse: (nurse: Nurse) => void;
  showUnverifiedOnly: boolean;
  setShowUnverifiedOnly: (show: boolean) => void;
  onVerifyClick: (nurse: Nurse, action: "verify" | "reject") => void;
}

function NurseTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-9 w-40 bg-muted animate-pulse rounded-md" />
          <div className="h-5 w-56 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-muted animate-pulse rounded" />
          <div className="h-4 w-36 bg-muted animate-pulse rounded" />
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
                  <TableHead>
                    <div className="h-4 w-28 bg-muted animate-pulse rounded" />
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
                    <TableCell>
                      <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                        <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                        <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                      </div>
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
  showUnverifiedOnly,
  setShowUnverifiedOnly,
  onVerifyClick,
}: NurseListPresentationalProps) {
  const tCommon = useTranslations("common");
  const tAdmin = useTranslations("admin");
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
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-unverified-nurses"
            checked={showUnverifiedOnly}
            onCheckedChange={(checked) =>
              setShowUnverifiedOnly(checked as boolean)
            }
          />
          <Label htmlFor="show-unverified-nurses">
            {tAdmin("showUnverifiedOnly")}
          </Label>
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
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewNurse(nurse)}
                            title={tCommon("view")}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {nurse.nurse?.account_status === "PENDING" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onVerifyClick(nurse, "verify")}
                                title={tAdmin("verify")}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onVerifyClick(nurse, "reject")}
                                title={tAdmin("reject")}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
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
