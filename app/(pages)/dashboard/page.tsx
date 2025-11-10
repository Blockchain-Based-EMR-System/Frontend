"use client";

import { DashboardContainer } from "@/features/dashboard/components/DashboardContainer";
import { DashboardPresentational } from "@/features/dashboard/components/DashboardPresentational";

export default function DashboardPage() {
  return (
    <>
      <DashboardContainer>
        {(props) => <DashboardPresentational {...props} />}
      </DashboardContainer>
    </>
  );
}
