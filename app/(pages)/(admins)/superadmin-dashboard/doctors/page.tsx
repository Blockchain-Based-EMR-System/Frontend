"use client";

import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { DoctorListContainer } from "@/features/admins/super-admin";

export default function DoctorsPage() {
  return (
    <SuperAdminLayout>
      <DoctorListContainer />
    </SuperAdminLayout>
  );
}
