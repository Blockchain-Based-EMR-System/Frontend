"use client";

import { Plus, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { Admin } from "@/types/user";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminListPresentationalProps {
  admins: Admin[];
  isLoading: boolean;
  onViewAdmin: (admin: Admin) => void;
  onAddAdmin: () => void;
}

export function AdminListPresentational({
  admins,
  isLoading,
  onViewAdmin,
  onAddAdmin,
}: AdminListPresentationalProps) {
  const tCommon = useTranslations("common");
  const tAdmin = useTranslations("admin");

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Admins...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{tAdmin("admins")}</h1>
          <p className="text-muted-foreground">{tAdmin("adminsDescription")}</p>
        </div>
        <Button onClick={onAddAdmin} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {tAdmin("addAdmin")}
        </Button>
      </div>

      {/* Break out of container padding on mobile */}
      <div className="-mx-6 md:mx-0 p-6 md:p-0">
        <Card className="rounded-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table style={{ minWidth: '800px' }}>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">{tCommon("name")}</TableHead>
                    <TableHead className="whitespace-nowrap">{tCommon("email")}</TableHead>
                    <TableHead className="whitespace-nowrap">{tCommon("username")}</TableHead>
                    <TableHead className="whitespace-nowrap">{tCommon("phone")}</TableHead>
                    <TableHead className="whitespace-nowrap">{tCommon("status")}</TableHead>
                    <TableHead className="text-right whitespace-nowrap">
                      {tCommon("actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {tAdmin("noAdminsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    admins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {admin.name}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {admin.email}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {admin.username || "N/A"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {admin.phone || "N/A"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge
                            variant={admin.isVerified ? "success" : "warning"}
                          >
                            {admin.isVerified ? tCommon("verified") : tCommon("pending")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewAdmin(admin)}
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
    </div>
  );
}