"use client";

import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { AdminListContainer } from "@/features/admins/super-admin";

export default function AdminsPage() {
  return (
    <SuperAdminLayout>
      <AdminListContainer />
    </SuperAdminLayout>
  );
}
