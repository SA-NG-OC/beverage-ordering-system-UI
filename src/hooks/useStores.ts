import { useEffect, useState } from "react";
import axios from "axios";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { storeApi } from "@/api/storeApi";
import type { StoreQueryParams } from "@/types/query-param.type";

interface UseStoresOptions {
  isPublic?: boolean;
  initialLimit?: number;
  isOpen?: boolean;
  isLocked?: boolean;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export function useStores(options: UseStoresOptions = {}) {
  const queryClient = useQueryClient();

  const isPublic = options.isPublic ?? true;
  const initialLimit = options.initialLimit || 10;

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState<boolean | undefined>(options.isOpen);
  const [isLocked, setIsLocked] = useState<boolean | undefined>(options.isLocked);
  const [sortBy, setSortBy] = useState<string | undefined>(options.sortBy);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | undefined>(options.sortOrder || "DESC");
  const [page, setPage] = useState(1);

  const queryParams: StoreQueryParams = {
    page,
    limit: initialLimit,
    search: search.trim() || undefined,
    isOpen,
    isLocked,
    sortBy,
    sortOrder,
  };

  const { data, isLoading, isFetching, isPlaceholderData, error, refetch } = useQuery({
    queryKey: ["stores", { isPublic, ...queryParams }],
    queryFn: async () => {
      const response = isPublic
        ? await storeApi.getPublicStores(queryParams)
        : await storeApi.getAdminStores(queryParams);
      return response.data.data;
    },
    placeholderData: keepPreviousData,
  });

  // Prefetch Next Page
  useEffect(() => {
    if (data?.meta && page < data.meta.totalPages) {
      const nextPageParams: StoreQueryParams = {
        ...queryParams,
        page: page + 1,
      };

      queryClient.prefetchQuery({
        queryKey: ["stores", { isPublic, ...nextPageParams }],
        queryFn: async () => {
          const response = isPublic
            ? await storeApi.getPublicStores(nextPageParams)
            : await storeApi.getAdminStores(nextPageParams);
          return response.data.data;
        },
      });
    }
  }, [data, page, queryParams, isPublic, queryClient]);

  const errorMessage = error
    ? axios.isAxiosError(error)
      ? error.response?.data?.message || "Failed to load store list."
      : "Failed to load store list."
    : null;

  return {
    stores: data?.items || [],
    meta: data?.meta || null,
    isLoading,
    isFetching,
    isPlaceholderData,
    error: errorMessage,
    search,
    setSearch: (val: string) => {
      setSearch(val);
      setPage(1);
    },
    isOpen,
    setIsOpen: (val?: boolean) => {
      setIsOpen(val);
      setPage(1);
    },
    isLocked,
    setIsLocked: (val?: boolean) => {
      setIsLocked(val);
      setPage(1);
    },
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    refresh: refetch,
  };
}

export default useStores;
