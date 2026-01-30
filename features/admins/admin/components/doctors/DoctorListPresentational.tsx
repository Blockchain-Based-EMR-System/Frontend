"use client";

import { Eye, ShieldCheck, Ban } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Doctor, DoctorAccountStatus, Gender } from "@/types/user";
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
import { DoctorUser } from "../../types/doctor.types";


interface DoctorListPresentationalProps {
  doctors: DoctorUser[];
  isLoading: boolean;
  onViewDoctor: (doctor: Doctor) => void;
  showUnverifiedOnly: boolean;
  setShowUnverifiedOnly: (show: boolean) => void;
  onVerify: (id: string, isApproved: boolean) => void;
}

export function DoctorListPresentational({
  doctors,
  isLoading,
  onViewDoctor,
  showUnverifiedOnly,
  setShowUnverifiedOnly,
  onVerify,
}: DoctorListPresentationalProps) {
  const tDoctor = useTranslations("doctor");
  const tCommon = useTranslations("common");
  const tAdmin = useTranslations("admin");
  const locale = useLocale();

  const castDoctorUserToDoctor = (doctorUser: DoctorUser): Doctor => {
    return {
      id: doctorUser.id,
      name: doctorUser.name,
      email: doctorUser.email,
      phone: doctorUser.phone,
      isVerified: doctorUser.isVerified,
      username: doctorUser.username,
      gender: doctorUser.gender as Gender | null | undefined,
      date_of_birth: doctorUser.date_of_birth,
      hasCompletedProfile: doctorUser.hasCompletedProfile,
      created_at: doctorUser.created_at ?? '',
      updated_at: doctorUser.updated_at ?? '',
      doctor: doctorUser.doctor
        ? {
            specialization: doctorUser.doctor.specialization,
            avg_time: doctorUser.doctor.avg_time,
            account_status: doctorUser.doctor.account_status as DoctorAccountStatus,
          }
        : undefined,
    };
  };

  if (isLoading) {
    return <DoctorTableSkeleton/>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {tDoctor("doctors")}
          </h1>
          <p className="text-muted-foreground">{tDoctor("manageDoctors")}</p>
        </div>
        <div className="flex items-center space-x-2">
            <Checkbox 
                id="show-unverified" 
                checked={showUnverifiedOnly}
                onCheckedChange={(checked) => setShowUnverifiedOnly(checked as boolean)}
            />
            <Label htmlFor="show-unverified">{tAdmin("showUnverifiedOnly")}</Label>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tCommon("name")}</TableHead>
                  <TableHead>{tCommon("email")}</TableHead>
                  <TableHead>{tCommon("phone")}</TableHead>
                  <TableHead>{tDoctor("specialization")}</TableHead>
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
                      {tDoctor("noDoctorsFound")}
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
                        {getSpecializationDisplay(castDoctorUserToDoctor(doctor), locale)}
                      </TableCell>
                      <TableCell>
                        {getAccountStatusBadge(
                          doctor.doctor?.account_status,
                          tCommon,
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {doctor.doctor?.account_status === 'PENDING' && (
                          <>
                             <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onVerify(doctor.id, true)}
                              title={tAdmin("verify")}
                            >
                              <ShieldCheck className="h-4 w-4 text-green-600" />
                            </Button>
                             <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onVerify(doctor.id, false)}
                              title={tAdmin("reject")}
                            >
                              <Ban className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDoctor(castDoctorUserToDoctor(doctor))}
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
