import type { Role } from "./enum/role.enum";

export interface RegisterDto {
    email: string;
    password: string;
    fullName: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface UserResponseDto {
    id: string;
    email: string;
    fullName: string;
    phone: string | null;
    role: Role;
    isBanned: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LoginResponseDto {
    accessToken: string;
    user: UserResponseDto;
}

export interface AccessTokenResponseDto {
    accessToken: string;
}

export interface MessageResponseDto {
    message: string;
}

