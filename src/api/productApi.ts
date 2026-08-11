import type { ProductQueryParams } from "@/types/query-param.type";
import axiosClient from "./axiosClient";
import type { ProductResponseDto, UpdateProductDto } from "@/types/product.type";
import type { ApiResponse, PaginatedData } from "@/types/pagination.type";

export const productApi = {
  getStaffProduct: (params?: ProductQueryParams) => {
    return axiosClient.get<ApiResponse<PaginatedData<ProductResponseDto>>>("/products", { params });
  },

  getPublicProduct: (params?: ProductQueryParams) => {
    return axiosClient.get<ApiResponse<PaginatedData<ProductResponseDto>>>("/products/public", {
      params,
    });
  },

  getById: (id: string) => {
    return axiosClient.get<ApiResponse<ProductResponseDto>>(`/products/${id}`);
  },

  getPublicById: (id: string) => {
    return axiosClient.get<ApiResponse<ProductResponseDto>>(`/products/public/${id}`);
  },

  update: (id: string, data: UpdateProductDto) => {
    return axiosClient.patch<ApiResponse<ProductResponseDto>>(`/products/${id}`, data);
  },
};
