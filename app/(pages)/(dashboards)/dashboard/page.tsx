"use client";

import { DashboardContainer } from "@/features/dashboards/dashboard/components/DashboardContainer";
import { DashboardPresentational } from "@/features/dashboards/dashboard/components/DashboardPresentational";

export default function DashboardPage() {
  return (
    <>
      <DashboardContainer>
        {(props) => <DashboardPresentational {...props} />}
      </DashboardContainer>
    </>
  );
}
