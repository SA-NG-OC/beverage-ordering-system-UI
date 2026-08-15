import axiosClient from "./axiosClient";
import type {
  CreateOrderDto,
  CancelOrderDto,
  UpdateOrderStatusDto,
  OrderResponseDto,
  OrderHistoryResponseDto,
} from "@/types/order.type";
import type { StaffOrderStatisticsResponseDto } from "@/types/statistics.type";
import type { ApiResponse, PaginatedData } from "@/types/pagination.type";
import type { OrderQueryParams, StatisticsQueryParams } from "@/types/query-param.type";

export const orderApi = {
  // Customer endpoints
  create: (data: CreateOrderDto) => {
    return axiosClient.post<ApiResponse<OrderResponseDto>>("/orders", data);
  },

  getCustomerHistory: (params?: OrderQueryParams) => {
    return axiosClient.get<ApiResponse<PaginatedData<OrderHistoryResponseDto>>>("/orders/history", {
      params,
    });
  },

  getCustomerOrderDetail: (id: string) => {
    return axiosClient.get<ApiResponse<OrderResponseDto>>(`/orders/${id}`);
  },

  cancelCustomerOrder: (id: string, data: CancelOrderDto) => {
    return axiosClient.patch<ApiResponse<OrderResponseDto>>(`/orders/${id}/cancel`, data);
  },

  // Staff endpoints
  getStaffOrders: (params?: OrderQueryParams) => {
    return axiosClient.get<ApiResponse<PaginatedData<OrderResponseDto>>>("/orders/staff", {
      params,
    });
  },

  getStaffOrderDetail: (id: string) => {
    return axiosClient.get<ApiResponse<OrderResponseDto>>(`/orders/staff/${id}`);
  },

  updateStaffOrderStatus: (id: string, data: UpdateOrderStatusDto) => {
    return axiosClient.patch<ApiResponse<OrderResponseDto>>(`/orders/staff/${id}/status`, data);
  },

  cancelStaffOrder: (id: string, data: CancelOrderDto) => {
    return axiosClient.patch<ApiResponse<OrderResponseDto>>(`/orders/staff/${id}/cancel`, data);
  },

  getStaffStatistics: (params?: StatisticsQueryParams) => {
    return axiosClient.get<ApiResponse<StaffOrderStatisticsResponseDto>>(
      "/orders/staff/statistics",
      {
        params,
      }
    );
  },

  // Admin endpoints
  getAdminOrders: (params?: OrderQueryParams) => {
    return axiosClient.get<ApiResponse<PaginatedData<OrderResponseDto>>>("/orders/admin", {
      params,
    });
  },

  getAdminOrderDetail: (id: string) => {
    return axiosClient.get<ApiResponse<OrderResponseDto>>(`/orders/admin/${id}`);
  },
};
