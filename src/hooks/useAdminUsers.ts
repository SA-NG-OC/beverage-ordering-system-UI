import { userApi } from "@/api/userApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export function useAdminUsers(initialLimit = 10) {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string | undefined>(undefined);
  const [isBanned, setIsBanned] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);

  const queryParams = {
    page,
    limit: initialLimit,
    search: search.trim() || undefined,
    role: role || undefined,
    isBanned,
    sortOrder: "DESC" as const,
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-users", queryParams],
    queryFn: async () => {
      const response = await userApi.getUsers(queryParams);
      return response.data.data;
    },
  });

  const lockUnlockMutation = useMutation({
    mutationFn: async ({
      userId,
      currentlyBanned,
    }: {
      userId: string;
      currentlyBanned: boolean;
    }) => {
      if (currentlyBanned) {
        return await userApi.unlockUser(userId);
      } else {
        return await userApi.lockUser(userId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const errorMessage = error
    ? axios.isAxiosError(error)
      ? error.response?.data?.message || "Failed to load users list."
      : "Failed to load users list."
    : null;

  return {
    users: data?.items || [],
    meta: data?.meta || null,
    isLoading,
    error: errorMessage,
    search,
    setSearch: (val: string) => {
      setSearch(val);
      setPage(1);
    },
    role,
    setRole: (val?: string) => {
      setRole(val);
      setPage(1);
    },
    isBanned,
    setIsBanned: (val?: boolean) => {
      setIsBanned(val);
      setPage(1);
    },
    page,
    setPage,
    handleLockUnlock: (userId: string, currentlyBanned: boolean) =>
      lockUnlockMutation.mutateAsync({ userId, currentlyBanned }),
    refresh: refetch,
  };
}
