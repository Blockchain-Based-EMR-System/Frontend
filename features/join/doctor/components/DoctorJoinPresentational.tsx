"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DoctorJoinForm } from "./doctorJoinForm/DoctorJoinForm";
import { DoctorJoinFormData } from "../types/doctorJoinTypes";

export interface DoctorJoinPresentationalProps {
  isLoading: boolean;
  handleJoin: (data: DoctorJoinFormData) => Promise<void>;
  tCommon: (key: string, values?: Record<string, any>) => string;
  tDoctorJoining: (key: string, values?: Record<string, any>) => string;
  tFields: (key: string, values?: Record<string, any>) => string;
}

export function DoctorJoinPresentational({
  isLoading,
  handleJoin,
  tDoctorJoining,
  tCommon,
  tFields,
}: DoctorJoinPresentationalProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{tDoctorJoining("title")}</CardTitle>
          <p className="text-sm text-muted-foreground">{tDoctorJoining("subtitle")}</p>
        </CardHeader>
        <CardContent>
          <DoctorJoinForm onSubmit={handleJoin} isLoading={isLoading} tCommon={tCommon} tDoctorJoining={tDoctorJoining} tFields={tFields} />
        </CardContent>
      </Card>
    </div>
  );
}
