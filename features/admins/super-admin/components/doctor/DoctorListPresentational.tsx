"use client";

import { useState } from "react";
import { Plus, Eye } from "lucide-react";
import { useLocale } from "next-intl";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  SPECIALIZATIONS,
  getSpecializationKey,
} from "@/constants/specializations";

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
  const locale = useLocale();
  const isArabic = locale === "ar";

  const getSpecializationDisplay = (doctor: Doctor) => {
    if (!doctor.doctor?.specialization) return "N/A";
    const key = doctor.doctor.specialization.key;
    if (key && SPECIALIZATIONS[key as keyof typeof SPECIALIZATIONS]) {
      return isArabic
        ? SPECIALIZATIONS[key as keyof typeof SPECIALIZATIONS].ar
        : SPECIALIZATIONS[key as keyof typeof SPECIALIZATIONS].en;
    }
    return doctor.doctor.specialization.value || "N/A";
  };

  const getAccountStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="warning">Unknown</Badge>;

    switch (status.toUpperCase()) {
      case "APPROVED":
        return <Badge variant="success">Approved</Badge>;
      case "PENDING":
        return <Badge variant="warning">Pending</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <p className="text-center">Loading Doctors...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctors</h1>
          <p className="text-muted-foreground">Manage doctors in the system</p>
        </div>
        <Button onClick={onAddDoctor} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
          Add Doctor
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Account Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No doctors found
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
                      <TableCell>{getSpecializationDisplay(doctor)}</TableCell>
                      <TableCell>
                        {getAccountStatusBadge(doctor.doctor?.account_status)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={doctor.isVerified ? "success" : "warning"}
                        >
                          {doctor.isVerified ? "Yes" : "No"}
                        </Badge>
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
