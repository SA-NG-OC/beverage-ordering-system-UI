import type { AccessTokenResponseDto, LoginDto, LoginResponseDto, MessageResponseDto, RegisterDto, UserResponseDto } from "@/types/auth.type";
import axiosClient from "./axiosClient";
import type { ApiResponse } from "@/types/pagination.type";

export const authApi = {
    register: (data: RegisterDto) => {
        axiosClient.post<ApiResponse<UserResponseDto>>('/auth/register', data);
    },

    login: (data: LoginDto) =>
        axiosClient.post<ApiResponse<LoginResponseDto>>('/auth/login', data),

    getMe: () =>
        axiosClient.get<ApiResponse<UserResponseDto>>('/auth/me'),

    refresh: () =>
        axiosClient.post<ApiResponse<AccessTokenResponseDto>>('/auth/refresh'),

    logout: () =>
        axiosClient.post<ApiResponse<MessageResponseDto>>('/auth/logout'),
}