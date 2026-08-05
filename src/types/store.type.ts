export interface StoreResponseDto {
    id: string;
    name: string;
    phone: string;
    address: string;
    isOpen: boolean;
    isLocked: boolean;
    rating: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateStoreDto {
    name: string;
    phone: string;
    address: string;
}

export interface UpdateStoreDto {
    name?: string;
    phone?: string;
    address?: string;
    isOpen?: boolean;
}