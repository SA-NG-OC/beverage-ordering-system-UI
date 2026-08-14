import { productApi } from "@/api/productApi";
import type { ProductStatus } from "@/types/product.type";
import { useEffect, useState } from "react";
import axios from "axios";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";

interface UseProductsOptions {
  isPublic?: boolean;
  initialLimit?: number;
  storeId?: string;
  categoryId?: string;
}

export function useProducts(options: UseProductsOptions | number = {}) {
  const queryClient = useQueryClient();

  const isPublic = typeof options === "object" ? options.isPublic : false;
  const initialLimit = typeof options === "number" ? options : options.initialLimit || 8;
  const defaultStoreId = typeof options === "object" ? options.storeId : undefined;
  const defaultCategoryId = typeof options === "object" ? options.categoryId : undefined;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProductStatus | undefined>(undefined);
  const [storeId, setStoreId] = useState<string | undefined>(defaultStoreId);
  const [categoryId, setCategoryId] = useState<string | undefined>(defaultCategoryId);
  const [page, setPage] = useState(1);

  const queryParams = {
    page,
    limit: initialLimit,
    search: search.trim() || undefined,
    status,
    storeId,
    categoryId,
  };

  const { data, isLoading, isFetching, isPlaceholderData, error, refetch } = useQuery({
    queryKey: ["products", { isPublic, ...queryParams }],
    queryFn: async () => {
      const response = isPublic
        ? await productApi.getPublicProduct(queryParams)
        : await productApi.getStaffProduct(queryParams);
      return response.data.data;
    },
    placeholderData: keepPreviousData,
  });

  // Prefetch dữ liệu trang tiếp theo (Next Page) vào Cache ngay khi ở trang hiện tại
  useEffect(() => {
    if (data?.meta && page < data.meta.totalPages) {
      const nextPageParams = {
        page: page + 1,
        limit: initialLimit,
        search: search.trim() || undefined,
        status,
        storeId,
        categoryId,
      };

      queryClient.prefetchQuery({
        queryKey: ["products", { isPublic, ...nextPageParams }],
        queryFn: async () => {
          const response = isPublic
            ? await productApi.getPublicProduct(nextPageParams)
            : await productApi.getStaffProduct(nextPageParams);
          return response.data.data;
        },
      });
    }
  }, [data, page, initialLimit, search, status, storeId, categoryId, isPublic, queryClient]);

  const errorMessage = error
    ? axios.isAxiosError(error)
      ? error.response?.data?.message || "Failed to load product list."
      : "Failed to load product list."
    : null;

  return {
    products: data?.items || [],
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
    status,
    setStatus: (val?: ProductStatus) => {
      setStatus(val);
      setPage(1);
    },
    storeId,
    setStoreId: (val?: string) => {
      setStoreId(val);
      setPage(1);
    },
    categoryId,
    setCategoryId: (val?: string) => {
      setCategoryId(val);
      setPage(1);
    },
    page,
    setPage,
    refresh: refetch,
  };
}
