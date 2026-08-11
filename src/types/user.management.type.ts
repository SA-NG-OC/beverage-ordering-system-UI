import type { Role } from "./enum/role.enum";
import type { StoreResponseDto } from "./store.type";

export interface StaffResponseDto {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: "staff";
  isBanned: boolean;
  storeId: string | null;
  store: StoreResponseDto | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffDto {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  storeId: string;
}

export interface UserManagementResponseDto {
  id: string;
  email: string;
  fullName: string;
  role: Role | string;
  storeId?: string | null;
  avatarUrl?: string | null;
  dob?: string | null;
  gender?: string | null;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  role?: string;
  isBanned?: boolean;
}
