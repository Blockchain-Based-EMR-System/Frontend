"use client";

import { Plus, Eye } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Doctor } from "@/types/user";
import { Button } from "@/components/ui/button";
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
import { DoctorTableSkeleton } from "../skeletons";

interface DoctorListPresentationalProps {
  doctors: Doctor[];
  isLoading: boolean;
  onViewDoctor: (doctor: Doctor) => void;
  onAddDoctor: () => void;
}

export function DoctorListPresentational({
  doctors,
  isLoading,
  onViewDoctor,
  onAddDoctor,
}: DoctorListPresentationalProps) {
  const tAdmin = useTranslations("superAdmin");
  const tCommon = useTranslations("common");
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
        <Button onClick={onAddDoctor} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {tAdmin("addDoctor")}
        </Button>
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
