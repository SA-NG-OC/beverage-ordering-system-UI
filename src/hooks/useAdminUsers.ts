import { userApi } from "@/api/userApi";
import type { PaginationMetaDto } from "@/types/pagination.type";
import type { UserManagementResponseDto } from "@/types/user.management.type";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export function useAdminUsers(initialLimit = 10) {
  const [users, setUsers] = useState<UserManagementResponseDto[]>([]);
  const [meta, setMeta] = useState<PaginationMetaDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string | undefined>(undefined);
  const [isBanned, setIsBanned] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await userApi.getUsers({
        page,
        limit: initialLimit,
        search: search.trim() || undefined,
        role: role || undefined,
        isBanned,
        sortOrder: "DESC",
      });

      setUsers(response.data.data.items);
      setMeta(response.data.data.meta);

      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to load users list");
      } else {
        setError("Failed to load users list.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, search, role, isBanned, initialLimit]);

  useEffect(() => {
    let isMounted = true;
    const loadUsers = async () => {
      try {
        setError(null);
        const response = await userApi.getUsers({
          page,
          limit: initialLimit,
          search: search.trim() || undefined,
          role: role || undefined,
          isBanned,
          sortOrder: "DESC",
        });
        if (isMounted) {
          setUsers(response.data.data.items);
          setMeta(response.data.data.meta);
        }
      } catch (err: unknown) {
        if (isMounted) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || "Failed to load users list.");
          } else {
            setError("Failed to load users list.");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadUsers();
    return () => {
      isMounted = false;
    };
  }, [page, search, role, isBanned, initialLimit]);

  const handleLockUnlock = async (userId: string, currentlyBanned: boolean) => {
    try {
      setError(null);
      if (currentlyBanned) {
        await userApi.unlockUser(userId);
      } else {
        await userApi.lockUser(userId);
      }

      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, isBanned: !currentlyBanned } : user))
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to change user status.");
      } else {
        setError("Failed to change user status.");
      }
    }
  };

  return {
    users,
    meta,
    isLoading,
    error,
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
    handleLockUnlock,
    refresh: fetchUsers,
  };
}
