"use client";

import { Plus, Eye, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Admin } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { AdminTableSkeleton } from "../skeletons";

interface AdminListPresentationalProps {
  admins: Admin[];
  isLoading: boolean;
  onViewAdmin: (admin: Admin) => void;
  onAddAdmin: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function AdminListPresentational({
  admins,
  isLoading,
  onViewAdmin,
  onAddAdmin,
  searchQuery,
  onSearchChange,
}: AdminListPresentationalProps) {
  const tCommon = useTranslations("common");
  const tAdmin = useTranslations("superAdmin");
  const tFields = useTranslations("fields");

  if (isLoading) {
    return <AdminTableSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {tAdmin("admins")}
          </h1>
          <p className="text-muted-foreground">{tAdmin("adminsDescription")}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="ps-9 w-64"
              placeholder={tAdmin("searchByNameOrPhone")}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button onClick={onAddAdmin} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
            {tAdmin("addAdmin")}
          </Button>
        </div>
      </div>

      {/* Break out of container padding on mobile */}
      <div className="-mx-6 md:mx-0 p-6 md:p-0">
        <Card className="rounded-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table style={{ minWidth: "800px" }}>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">
                      {tFields("name")}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      {tFields("email")}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      {tFields("username")}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      {tFields("phoneNumber")}
                    </TableHead>
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
