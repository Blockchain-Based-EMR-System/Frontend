"use client";

import { useTranslations } from "next-intl";
import { useDashboard } from "../query/useDashboard.query";
import { useLogout } from "@/features/auth/login/query/useLogin.query";
import { DashboardUser } from "../types/dashboardTypes";

export interface DashboardContainerProps {
  children: (props: DashboardPresentationalProps) => React.ReactNode;
}

export interface DashboardPresentationalProps {
  user: DashboardUser | null;
  isLoading: boolean;
  isError: boolean;
  onLogout: () => void;
  tDashboard: (key: string) => string;
  tFields: (key: string) => string;
  tCommon: (key: string) => string;
}

export function DashboardContainer({ children }: DashboardContainerProps) {
  const tDashboard = useTranslations("userDashboard");
  const tFields = useTranslations("fields");
  const tCommon = useTranslations("common");
  const { data: user, isLoading, isError } = useDashboard();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      {children({
        user: user || null,
        isLoading,
        isError,
        onLogout: handleLogout,
        tDashboard,
        tFields,
        tCommon,
      })}
    </>
  );
}
