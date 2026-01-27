"use client";

import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Stethoscope, Activity } from "lucide-react";
import { useAdmins } from "@/features/admins/super-admin/query/useAdmin.query";
import { useDoctors } from "@/features/admins/super-admin/query/useDoctor.query";

export default function SuperAdminDashboardPage() {
  const { data: adminsData } = useAdmins();
  const { data: doctorsData } = useDoctors();

  const adminsCount = adminsData?.data?.length || 0;
  const doctorsCount = doctorsData?.data?.length || 0;

  const stats = [
    {
      title: "Total Admins",
      value: adminsCount,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Total Doctors",
      value: doctorsCount,
      icon: Stethoscope,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "System Status",
      value: "Active",
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Super Admin Dashboard
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-full p-2 ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No recent activity to display
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Use the sidebar to manage admins and doctors
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
