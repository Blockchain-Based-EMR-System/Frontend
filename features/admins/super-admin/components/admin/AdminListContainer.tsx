"use client";

import { useState } from "react";
import { Admin } from "@/types/user";
import { useAdmins } from "../../query/useAdmin.query";
import { AdminListPresentational } from "./AdminListPresentational";
import { AdminDetailDialog } from "./AdminDetailDialog";
import { AddAdminDialog } from "./addAdminForm/AddAdminDialog";

export function AdminListContainer() {
  const { data, isLoading } = useAdmins();
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const admins = data?.data || [];

  return (
    <>
      <AdminListPresentational
        admins={admins}
        isLoading={isLoading}
        onViewAdmin={setSelectedAdmin}
        onAddAdmin={() => setIsAddDialogOpen(true)}
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
