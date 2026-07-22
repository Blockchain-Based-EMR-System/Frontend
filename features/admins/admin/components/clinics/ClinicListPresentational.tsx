"use client";

import { Eye, Power, PowerOff, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Clinic } from "../../types/clinic.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
import { ClinicTableSkeleton } from "../../skeletons/ClinicTableSkeleton";

interface ClinicListPresentationalProps {
  clinics: Clinic[];
  isLoading: boolean;
  onViewClinic: (clinic: Clinic) => void;
  onToggleStatus: (clinic: Clinic) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  showInactiveOnly: boolean;
  onShowInactiveOnlyChange: (v: boolean) => void;
}

export function ClinicListPresentational({
  clinics,
  isLoading,
  onViewClinic,
  onToggleStatus,
  searchQuery,
  onSearchChange,
  showInactiveOnly,
  onShowInactiveOnlyChange,
}: ClinicListPresentationalProps) {
  const tCommon = useTranslations("common");
  const tAdmin = useTranslations("admin");
  const tFields = useTranslations("fields");

  if (isLoading) {
    return <ClinicTableSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {tAdmin("clinics")}
          </h1>
          <p className="text-muted-foreground">{tAdmin("manageClinics")}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="ps-9 w-64"
              placeholder={tAdmin("searchByNameOrPhone")}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Checkbox
              id="show-inactive-clinics"
              checked={showInactiveOnly}
              onCheckedChange={(checked) =>
                onShowInactiveOnlyChange(checked as boolean)
              }
            />
            <Label htmlFor="show-inactive-clinics">
              {tAdmin("showInactiveOnly")}
            </Label>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">
                    {tFields("name")}
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    {tFields("phoneNumber")}
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    {tAdmin("status")}
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    {tAdmin("hours")}
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    {tAdmin("onlinePayment")}
                  </TableHead>
                  <TableHead className="text-right whitespace-nowrap">
                    {tCommon("actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clinics.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {tAdmin("noClinicsFound")}
                    </TableCell>
                  </TableRow>
                ) : (
                  clinics.map((clinic) => (
                    <TableRow key={clinic.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {clinic.name}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {clinic.phone || "N/A"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge
                          variant={clinic.is_active ? "default" : "secondary"}
                        >
                          {clinic.is_active
                            ? tAdmin("active")
                            : tAdmin("inactive")}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {clinic.opening_at} - {clinic.closing_at}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge
                          variant={clinic.canPayOnline ? "default" : "outline"}
                        >
                          {clinic.canPayOnline
                            ? tAdmin("enabled")
                            : tAdmin("disabled")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleStatus(clinic)}
                          title={
                            clinic.is_active
                              ? tAdmin("deactivate")
                              : tAdmin("activate")
                          }
                        >
                          {clinic.is_active ? (
                            <PowerOff className="h-4 w-4 text-red-600" />
                          ) : (
                            <Power className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewClinic(clinic)}
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
