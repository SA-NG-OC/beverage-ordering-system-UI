import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import { orderApi } from "@/api/orderApi";
import type {
  CreateOrderDto,
  CancelOrderDto,
  UpdateOrderStatusDto,
  OrderStatus,
} from "@/types/order.type";
import type { StatisticsQueryParams } from "@/types/query-param.type";

interface UseCustomerOrdersOptions {
  initialLimit?: number;
  status?: OrderStatus;
}

export function useCustomerOrders(options: UseCustomerOrdersOptions = {}) {
  const queryClient = useQueryClient();
  const initialLimit = options.initialLimit || 10;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | undefined>(options.status);

  const queryParams = useMemo(
    () => ({
      page,
      limit: initialLimit,
      search: search.trim() || undefined,
      status,
    }),
    [page, initialLimit, search, status]
  );

  const { data, isLoading, isFetching, isPlaceholderData, error, refetch } = useQuery({
    queryKey: ["customer-orders", queryParams],
    queryFn: async () => {
      const response = await orderApi.getCustomerHistory(queryParams);
      return response.data.data;
    },
    placeholderData: keepPreviousData,
  });

  // Prefetch next page
  useEffect(() => {
    if (data?.meta && page < data.meta.totalPages) {
      const nextPageParams = { ...queryParams, page: page + 1 };
      queryClient.prefetchQuery({
        queryKey: ["customer-orders", nextPageParams],
        queryFn: async () => {
          const response = await orderApi.getCustomerHistory(nextPageParams);
          return response.data.data;
        },
      });
    }
  }, [data, page, queryClient, queryParams]);

  const errorMessage = error
    ? axios.isAxiosError(error)
      ? error.response?.data?.message || "Failed to load order history."
      : "Failed to load order history."
    : null;

  return {
    orders: data?.items || [],
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
    setStatus: (val?: OrderStatus) => {
      setStatus(val);
      setPage(1);
    },
    page,
    setPage,
    refetch,
  };
}

export function useCustomerOrderDetail(orderId?: string) {
  return useQuery({
    queryKey: ["customer-order", orderId],
    queryFn: async () => {
      if (!orderId) throw new Error("Order ID is required");
      const response = await orderApi.getCustomerOrderDetail(orderId);
      return response.data.data;
    },
    enabled: !!orderId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrderDto) => {
      const response = await orderApi.create(data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
    },
  });
}

export function useCancelCustomerOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CancelOrderDto }) => {
      const response = await orderApi.cancelCustomerOrder(id, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
      queryClient.invalidateQueries({ queryKey: ["customer-order", variables.id] });
    },
  });
}

// Staff Order Hooks
interface UseStaffOrdersOptions {
  initialLimit?: number;
  status?: OrderStatus;
}

export function useStaffOrders(options: UseStaffOrdersOptions = {}) {
  const queryClient = useQueryClient();
  const initialLimit = options.initialLimit || 10;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | undefined>(options.status);

  const queryParams = useMemo(
    () => ({
      page,
      limit: initialLimit,
      search: search.trim() || undefined,
      status,
    }),
    [page, initialLimit, search, status]
  );

  const { data, isLoading, isFetching, isPlaceholderData, error, refetch } = useQuery({
    queryKey: ["staff-orders", queryParams],
    queryFn: async () => {
      const response = await orderApi.getStaffOrders(queryParams);
      return response.data.data;
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.meta && page < data.meta.totalPages) {
      const nextPageParams = { ...queryParams, page: page + 1 };
      queryClient.prefetchQuery({
        queryKey: ["staff-orders", nextPageParams],
        queryFn: async () => {
          const response = await orderApi.getStaffOrders(nextPageParams);
          return response.data.data;
        },
      });
    }
  }, [data, page, queryClient, queryParams]);

  const errorMessage = error
    ? axios.isAxiosError(error)
      ? error.response?.data?.message || "Failed to load staff orders."
      : "Failed to load staff orders."
    : null;

  return {
    orders: data?.items || [],
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
    setStatus: (val?: OrderStatus) => {
      setStatus(val);
      setPage(1);
    },
    page,
    setPage,
    refetch,
  };
}

export function useStaffOrderDetail(orderId?: string) {
  return useQuery({
    queryKey: ["staff-order", orderId],
    queryFn: async () => {
      if (!orderId) throw new Error("Order ID is required");
      const response = await orderApi.getStaffOrderDetail(orderId);
      return response.data.data;
    },
    enabled: !!orderId,
  });
}

export function useUpdateStaffOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOrderStatusDto }) => {
      const response = await orderApi.updateStaffOrderStatus(id, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["staff-orders"] });
      queryClient.invalidateQueries({ queryKey: ["staff-order", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["staff-statistics"] });
    },
  });
}

export function useCancelStaffOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CancelOrderDto }) => {
      const response = await orderApi.cancelStaffOrder(id, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["staff-orders"] });
      queryClient.invalidateQueries({ queryKey: ["staff-order", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["staff-statistics"] });
    },
  });
}

export function useStaffOrderStatistics(params?: StatisticsQueryParams) {
  return useQuery({
    queryKey: ["staff-statistics", params],
    queryFn: async () => {
      const response = await orderApi.getStaffStatistics(params);
      return response.data.data;
    },
  });
}

// Admin Order Hooks
interface UseAdminOrdersOptions {
  initialLimit?: number;
  status?: OrderStatus;
  storeId?: string;
  customerId?: string;
}

export function useAdminOrders(options: UseAdminOrdersOptions = {}) {
  const queryClient = useQueryClient();
  const initialLimit = options.initialLimit || 10;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | undefined>(options.status);
  const [storeId, setStoreId] = useState<string | undefined>(options.storeId);
  const [customerId, setCustomerId] = useState<string | undefined>(options.customerId);

  const queryParams = useMemo(
    () => ({
      page,
      limit: initialLimit,
      search: search.trim() || undefined,
      status,
      storeId,
      customerId,
    }),
    [page, initialLimit, search, status, storeId, customerId]
  );

  const { data, isLoading, isFetching, isPlaceholderData, error, refetch } = useQuery({
    queryKey: ["admin-orders", queryParams],
    queryFn: async () => {
      const response = await orderApi.getAdminOrders(queryParams);
      return response.data.data;
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.meta && page < data.meta.totalPages) {
      const nextPageParams = { ...queryParams, page: page + 1 };
      queryClient.prefetchQuery({
        queryKey: ["admin-orders", nextPageParams],
        queryFn: async () => {
          const response = await orderApi.getAdminOrders(nextPageParams);
          return response.data.data;
        },
      });
    }
  }, [data, page, queryClient, queryParams]);

  const errorMessage = error
    ? axios.isAxiosError(error)
      ? error.response?.data?.message || "Failed to load admin orders."
      : "Failed to load admin orders."
    : null;

  return {
    orders: data?.items || [],
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
    setStatus: (val?: OrderStatus) => {
      setStatus(val);
      setPage(1);
    },
    storeId,
    setStoreId: (val?: string) => {
      setStoreId(val);
      setPage(1);
    },
    customerId,
    setCustomerId: (val?: string) => {
      setCustomerId(val);
      setPage(1);
    },
    page,
    setPage,
    refetch,
  };
}

export function useAdminOrderDetail(orderId?: string) {
  return useQuery({
    queryKey: ["admin-order", orderId],
    queryFn: async () => {
      if (!orderId) throw new Error("Order ID is required");
      const response = await orderApi.getAdminOrderDetail(orderId);
      return response.data.data;
    },
    enabled: !!orderId,
  });
}
