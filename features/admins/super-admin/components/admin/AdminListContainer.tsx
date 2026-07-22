"use client";

import { useState, useMemo } from "react";
import { Admin } from "@/types/user";
import { useAdmins } from "../../query/useAdmin.query";
import { AdminListPresentational } from "./AdminListPresentational";
import { AdminDetailDialog } from "./AdminDetailDialog";
import { AddAdminDialog } from "./addAdminForm/AddAdminDialog";

export function AdminListContainer() {
  const { data, isLoading } = useAdmins();
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAdmins = useMemo(() => {
    const allAdmins = data?.data || [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allAdmins;
    return allAdmins.filter(
      (a) =>
        (a.name?.toLowerCase().includes(q) ?? false) ||
        (a.phone?.toLowerCase().includes(q) ?? false),
    );
  }, [data, searchQuery]);

  return (
    <>
      <AdminListPresentational
        admins={filteredAdmins}
        isLoading={isLoading}
        onViewAdmin={setSelectedAdmin}
        onAddAdmin={() => setIsAddDialogOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {selectedAdmin && (
        <AdminDetailDialog
          admin={selectedAdmin}
          open={!!selectedAdmin}
          onClose={() => setSelectedAdmin(null)}
        />
      )}

      <AddAdminDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
    </>
  );
}
