import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { storeApi } from "@/api/storeApi";

export function useStoreDetail(storeId?: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["store", storeId],
    queryFn: async () => {
      if (!storeId) return null;
      const response = await storeApi.getStoreById(storeId);
      return response.data.data;
    },
    enabled: !!storeId,
  });

  const errorMessage = error
    ? axios.isAxiosError(error)
      ? error.response?.data?.message || "Failed to load store details."
      : "Failed to load store details."
    : null;

  return {
    store: data || null,
    isLoading,
    error: errorMessage,
    refresh: refetch,
  };
}

export default useStoreDetail;
