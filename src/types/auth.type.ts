export interface RegisterDto {
    email: string;
    password: string;
    fullname: string;
    phone?: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface UserResponseDto {
    id: string;
    email: string;
    fullname: string;
    phone: string | null;
    role: 'customer' | 'staff' | 'admin';
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

