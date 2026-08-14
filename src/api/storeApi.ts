import axiosClient from "./axiosClient";
import type { CreateStoreDto, StoreResponseDto, UpdateStoreDto } from "@/types/store.type";
import type { StoreQueryParams } from "@/types/query-param.type";
import type { ApiResponse, PaginatedData } from "@/types/pagination.type";

export const storeApi = {
  // Public APIs
  getPublicStores: (params?: StoreQueryParams) => {
    return axiosClient.get<ApiResponse<PaginatedData<StoreResponseDto>>>("/stores", { params });
  },

  getStoreById: (id: string) => {
    return axiosClient.get<ApiResponse<StoreResponseDto>>(`/stores/${id}`);
  },

  // Admin APIs
  getAdminStores: (params?: StoreQueryParams) => {
    return axiosClient.get<ApiResponse<PaginatedData<StoreResponseDto>>>("/stores/admin", {
      params,
    });
  },

  createStore: (data: CreateStoreDto) => {
    return axiosClient.post<ApiResponse<StoreResponseDto>>("/stores", data);
  },

  updateStore: (id: string, data: UpdateStoreDto) => {
    return axiosClient.patch<ApiResponse<StoreResponseDto>>(`/stores/${id}`, data);
  },

  lockStore: (id: string) => {
    return axiosClient.patch<ApiResponse<StoreResponseDto>>(`/stores/${id}/lock`);
  },

  unlockStore: (id: string) => {
    return axiosClient.patch<ApiResponse<StoreResponseDto>>(`/stores/${id}/unlock`);
  },

  // Staff APIs
  getStaffStore: () => {
    return axiosClient.get<ApiResponse<StoreResponseDto>>("/staff/store");
  },

  updateStaffStore: (data: UpdateStoreDto) => {
    return axiosClient.patch<ApiResponse<StoreResponseDto>>("/staff/store", data);
  },
};

export default storeApi;
