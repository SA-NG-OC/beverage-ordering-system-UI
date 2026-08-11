import { useCallback, useEffect, useState } from "react";
import { productApi } from "@/api/productApi";
import type { ProductResponseDto } from "@/types/product.type";
import axios from "axios";

export function useProductDetail(productId?: string, isPublic = false) {
  const [product, setProduct] = useState<ProductResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => !!productId);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!productId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = isPublic
        ? await productApi.getPublicById(productId)
        : await productApi.getById(productId);

      setProduct(response.data.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to load product details.");
      } else {
        setError("Failed to load product details.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [productId, isPublic]);

  useEffect(() => {
    if (!productId) {
      return;
    }

    let isMounted = true;

    const loadData = async () => {
      try {
        setError(null);
        const response = isPublic
          ? await productApi.getPublicById(productId)
          : await productApi.getById(productId);

        if (isMounted) {
          setProduct(response.data.data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || "Failed to load product details.");
          } else {
            setError("Failed to load product details.");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [productId, isPublic]);

  return {
    product,
    isLoading,
    error,
    refresh: fetchDetail,
  };
}
