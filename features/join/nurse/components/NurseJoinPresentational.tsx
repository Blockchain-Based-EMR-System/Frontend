"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NurseJoinForm } from "./nurseJoinForm/NurseJoinForm";
import { NurseJoinFormData } from "../types/nurseJoinTypes";

export interface NurseJoinPresentationalProps {
  isLoading: boolean;
  handleJoin: (data: NurseJoinFormData) => Promise<void>;
  tCommon: (key: string, values?: Record<string, any>) => string;
  tNurse: (key: string, values?: Record<string, any>) => string;
  tFields: (key: string, values?: Record<string, any>) => string;
}

export function NurseJoinPresentational({
  isLoading,
  handleJoin,
  tNurse,
  tCommon,
  tFields,
}: NurseJoinPresentationalProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {tNurse("title")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{tNurse("subtitle")}</p>
        </CardHeader>
        <CardContent>
          <NurseJoinForm
            onSubmit={handleJoin}
            isLoading={isLoading}
            tCommon={tCommon}
            tNurse={tNurse}
            tFields={tFields}
          />
        </CardContent>
      </Card>
    </div>
  );
}
