"use client";

import { Eye, CheckCircle, XCircle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
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
import {
  getSpecializationDisplay,
  getAccountStatusBadge,
} from "@/features/admins/utils";
import { DoctorTableSkeleton } from "../../skeletons/DoctorTableSkeleton";
import { Doctor } from "@/types/user";

interface DoctorListPresentationalProps {
  doctors: Doctor[];
  isLoading: boolean;
  onViewDoctor: (doctor: Doctor) => void;
  showUnverifiedOnly: boolean;
  setShowUnverifiedOnly: (show: boolean) => void;
  onVerifyClick: (doctor: Doctor, action: "verify" | "reject") => void;
}

export function DoctorListPresentational({
  doctors,
  isLoading,
  onViewDoctor,
  showUnverifiedOnly,
  setShowUnverifiedOnly,
  onVerifyClick,
}: DoctorListPresentationalProps) {
  const tCommon = useTranslations("common");
  const tAdmin = useTranslations("admin");
  const tFields = useTranslations("fields");
  const locale = useLocale();

  if (isLoading) {
    return <DoctorTableSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {tAdmin("doctors")}
          </h1>
          <p className="text-muted-foreground">{tAdmin("manageDoctors")}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-unverified"
            checked={showUnverifiedOnly}
            onCheckedChange={(checked) =>
              setShowUnverifiedOnly(checked as boolean)
            }
          />
          <Label htmlFor="show-unverified">
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
                  <TableHead>{tAdmin("specialization")}</TableHead>
                  <TableHead>{tCommon("accountStatus")}</TableHead>
                  <TableHead className="text-right">
                    {tCommon("actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {tAdmin("noDoctorsFound")}
                    </TableCell>
                  </TableRow>
                ) : (
                  doctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell className="font-medium">
                        {doctor.name}
                      </TableCell>
                      <TableCell>{doctor.email}</TableCell>
                      <TableCell>{doctor.phone || "N/A"}</TableCell>
                      <TableCell>
                        {getSpecializationDisplay(doctor, locale)}
                      </TableCell>
                      <TableCell>
                        {getAccountStatusBadge(
                          doctor.doctor?.account_status,
                          tCommon,
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {doctor.doctor?.account_status === "PENDING" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onVerifyClick(doctor, "verify")}
                              title={tAdmin("verify")}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onVerifyClick(doctor, "reject")}
                              title={tAdmin("reject")}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDoctor(doctor)}
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
