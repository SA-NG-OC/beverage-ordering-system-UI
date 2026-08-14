import { categoryApi } from "@/api/categoryApi";
import { useQuery } from "@tanstack/react-query";

export function useCategories() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["categories-all"],
    queryFn: async () => {
      const response = await categoryApi.getAll();
      return response.data.data;
    },
    staleTime: 1000 * 60 * 10,
  });

  return {
    categories: data || [],
    isLoading,
    error,
  };
}
