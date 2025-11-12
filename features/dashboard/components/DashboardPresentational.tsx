"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardUser } from "../types/dashboardTypes";
import { Loader2, User, LogOut } from "lucide-react";

export interface DashboardPresentationalProps {
  user: DashboardUser | null;
  isLoading: boolean;
  isError: boolean;
  onLogout: () => void;
  t: (key: string) => string;
}

export function DashboardPresentational({
  user,
  isLoading,
  isError,
  onLogout,
  t,
}: DashboardPresentationalProps) {
  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">{t("error")}</CardTitle>
            <CardDescription>{t("failedToLoadUserData")}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
            <p className="text-muted-foreground">{t("dashboardDescription")}</p>
          </div>
          <Button variant="outline" onClick={onLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            {t("signOut")}
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">
                  {t("welcomeBack")}, {user.name}!
                </CardTitle>
                <CardDescription className="text-base">
                  {t("dashboardDescription")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("email")}</p>
                <p className="font-medium">{user.email}</p>
              </div>
              {user.phone && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {t("phoneNumber")}
                  </p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              )}
              {user.gender && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("gender")}</p>
                  <p className="font-medium">{t(user.gender.toLowerCase())}</p>
                </div>
              )}
              {user.date_of_birth && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {t("dateOfBirth")}
                  </p>
                  <p className="font-medium">
                    {new Date(user.date_of_birth).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {t("accountStatus")}
                </p>
                <p className="font-medium">
                  {user.isVerified ? t("verified") : t("notVerified")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {t("profileStatus")}
                </p>
                <p className="font-medium">
                  {user.hasCompletedProfile ? t("completed") : t("incomplete")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{t("recentActivity")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("noActivityYet")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("statistics")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("noStatisticsYet")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("quickActions")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t("comingSoon")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
