import axiosClient from "./axiosClient";
import type { ApiResponse } from "@/types/pagination.type";
import type { CategoryItemDto } from "@/types/category.type";

export const categoryApi = {
  getAll: () => {
    return axiosClient.get<ApiResponse<CategoryItemDto[]>>("/categories/all");
  },
};
