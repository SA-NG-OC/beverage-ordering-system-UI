import { productApi } from "@/api/productApi";
import type { PaginationMetaDto } from "@/types/pagination.type";
import type { ProductResponseDto, ProductStatus } from "@/types/product.type";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

interface UseProductsOptions {
  isPublic?: boolean;
  initialLimit?: number;
  storeId?: string;
  categoryId?: string;
}

export function useProducts(options: UseProductsOptions | number = {}) {
  const isPublic = typeof options === "object" ? options.isPublic : false;
  const initialLimit = typeof options === "number" ? options : options.initialLimit || 8;
  const defaultStoreId = typeof options === "object" ? options.storeId : undefined;
  const defaultCategoryId = typeof options === "object" ? options.categoryId : undefined;

  const [products, setProducts] = useState<ProductResponseDto[]>([]);
  const [meta, setMeta] = useState<PaginationMetaDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProductStatus | undefined>(undefined);
  const [storeId, setStoreId] = useState<string | undefined>(defaultStoreId);
  const [categoryId, setCategoryId] = useState<string | undefined>(defaultCategoryId);
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {
        page,
        limit: initialLimit,
        search: search.trim() || undefined,
        status,
        storeId,
        categoryId,
      };

      const response = isPublic
        ? await productApi.getPublicProduct(params)
        : await productApi.getStaffProduct(params);

      setProducts(response.data.data.items);
      setMeta(response.data.data.meta);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to load product list.");
      } else {
        setError("Failed to load product list.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, search, status, storeId, categoryId, initialLimit, isPublic]);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setError(null);

        const params = {
          page,
          limit: initialLimit,
          search: search.trim() || undefined,
          status,
          storeId,
          categoryId,
        };

        const response = isPublic
          ? await productApi.getPublicProduct(params)
          : await productApi.getStaffProduct(params);

        if (isMounted) {
          setProducts(response.data.data.items);
          setMeta(response.data.data.meta);
        }
      } catch (err: unknown) {
        if (isMounted) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || "Failed to load product list.");
          } else {
            setError("Failed to load product list.");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [page, search, status, storeId, categoryId, initialLimit, isPublic]);

  return {
    products,
    meta,
    isLoading,
    error,
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
    refresh: fetchProducts,
  };
}
