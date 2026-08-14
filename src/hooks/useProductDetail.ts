import { productApi } from "@/api/productApi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useProductDetail(productId?: string, isPublic = false) {
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product-detail", productId, isPublic],
    queryFn: async () => {
      if (!productId) return null;
      const response = isPublic
        ? await productApi.getPublicById(productId)
        : await productApi.getById(productId);

      return response.data.data;
    },
    enabled: !!productId,
  });

  const errorMessage = error
    ? axios.isAxiosError(error)
      ? error.response?.data?.message || "Failed to load product details."
      : "Failed to load product details."
    : null;

  return {
    product: product || null,
    isLoading: isLoading && !!productId,
    error: errorMessage,
    refresh: refetch,
  };
}
