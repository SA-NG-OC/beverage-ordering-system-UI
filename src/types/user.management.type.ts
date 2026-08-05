import type { StoreResponseDto } from "./store.type";

export interface StaffResponseDto {
    id: string;
    email: string;
    fullName: string;
    phone: string | null;
    role: 'staff';
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
    phone: string | null;
    role: 'customer' | 'staff' | 'admin';
    isBanned: boolean;
    createdAt: string;
    updatedAt: string;
}