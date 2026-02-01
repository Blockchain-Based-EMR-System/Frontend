import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { DashboardUser } from "../types/dashboardTypes";
import { useUserStore } from "@/stores/useUserStore";
import { getCurrentUser } from "../api/dashboard.api";

export const useDashboard = (): UseQueryResult<DashboardUser, Error> => {
  const user = useUserStore((state) => state.user);
  const hasHydrated = useUserStore((state) => state._hasHydrated);
  const setUser = useUserStore((state) => state.setUser);

  return useQuery({
    queryKey: ["dashboard", "user"],
    queryFn: async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        return userData as DashboardUser;
      } catch (error) {
        throw new Error("Failed to load user data");
      }
    },
    enabled: hasHydrated,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    initialData: user ? (user as DashboardUser) : undefined,
  });
};
