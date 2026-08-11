import type { OrderStatus } from "./order.type";
import type { ProductStatus } from "./product.type";

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface StoreQueryParams extends PaginationParams {
  isOpen?: boolean;
  isLocked?: boolean;
}

export interface ProductQueryParams extends PaginationParams {
  storeId?: string;
  categoryId?: string;
  status?: ProductStatus;
}

export interface OrderQueryParams extends PaginationParams {
  status?: OrderStatus;
  storeId?: string;
  customerId?: string;
}

export interface UserQueryParams extends PaginationParams {
  role?: "customer" | "staff" | "admin";
  isBanned?: boolean;
}

export interface StaffQueryParams extends PaginationParams {
  storeId?: string;
  isBanned?: boolean;
}

export interface StatisticsQueryParams {
  from?: string; // 'YYYY-MM-DD'
  to?: string; // 'YYYY-MM-DD'
}
