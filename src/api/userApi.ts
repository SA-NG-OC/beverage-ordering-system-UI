import axiosClient from "./axiosClient";
import type { UserManagementResponseDto, UserQueryParams } from "@/types/user.management.type";
import type { ApiResponse, PaginatedData } from "@/types/pagination.type";

export const userApi = {
    getUsers: (params?: UserQueryParams) => {
        return axiosClient.get<ApiResponse<PaginatedData<UserManagementResponseDto>>>('/admin/users', { params });
    },

    lockUser: (id: string) => {
        return axiosClient.patch<ApiResponse<UserManagementResponseDto>>(`/admin/users/${id}/lock`);
    },

    unlockUser: (id: string) => {
        return axiosClient.patch<ApiResponse<UserManagementResponseDto>>(`/admin/users/${id}/unlock`);
    },
};