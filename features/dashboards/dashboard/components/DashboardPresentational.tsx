"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardUser } from "../types/dashboardTypes";
import { Loader2, User } from "lucide-react";

export interface DashboardPresentationalProps {
  user: DashboardUser | null;
  isLoading: boolean;
  isError: boolean;
  onLogout: () => void;
  tDashboard: (key: string) => string;
  tFields: (key: string) => string;
  tCommon: (key: string) => string;
}

export function DashboardPresentational({
  user,
  isLoading,
  isError,
  tDashboard,
  tFields,
  tCommon,
}: DashboardPresentationalProps) {
  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{tCommon("loading")}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">{tCommon("error")}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <Card className="mb-6">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">
                  {tDashboard("welcomeBack")}, {user.name}!
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{tFields("email")}</p>
                <p className="font-medium">{user.email}</p>
              </div>
              {user.phone && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {tFields("phoneNumber")}
                  </p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              )}
              {user.gender && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{tFields("gender")}</p>
                  <p className="font-medium">{tFields(user.gender.toLowerCase())}</p>
                </div>
              )}
              {user.date_of_birth && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {tFields("dateOfBirth")}
                  </p>
                  <p className="font-medium">
                    {new Date(user.date_of_birth).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
